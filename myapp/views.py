# views.py
from django.shortcuts import render
from django.http import StreamingHttpResponse
import cv2
from ultralytics import YOLO
from django.core.files.base import ContentFile
from .models import TrashAlert
from django.utils.timezone import localtime
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
import time  # Add this import
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse
import numpy as np
from scipy.spatial import distance as dist
import math
from datetime import datetime, timedelta
import os
from openpyxl import load_workbook
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

print("Loading views.py")  # Add this line

# Constants and initializations
LOCATION_NAME = "Los Banos, Philippines"
filepathexcel = "C:/Users/Jaderick/Desktop/detectionalgo/runs/detect/train2/litter.detect.v91.yolov8/Book1.xlsx"
wb = load_workbook(filepathexcel)
OUTPUT_DIR_URL = '/output_directory/'
OUTPUT_DIR_PATH = "C:/Users/Jaderick/Desktop/detectionalgo/runs/detect/train2/frames"
os.makedirs(OUTPUT_DIR_PATH, exist_ok=True)
model = YOLO("C:/Users/Jaderick/Desktop/detectionalgo/runs/detect/train2/weights/18k_openvino_model/18k.pt")

def list_output_files(request):
    output_files = []
    output_dir = settings.OUTPUT_DIR_PATH

    if os.path.exists(output_dir):
        for filename in os.listdir(output_dir):
            file_url = f"{settings.OUTPUT_DIR_URL}{filename}"
            output_files.append({"filename": filename, "file_url": file_url})

    return JsonResponse({"output_files": output_files})

y = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240]
x1 = [245, 215, 200, 180, 160, 145, 138, 122, 114, 110, 98, 80]
x2 = [940, 933, 877, 804, 738, 678, 621, 568, 522, 479, 444, 406]

coffh = np.polyfit(x2, y, 2)
cofft = np.polyfit(x1, y, 2)

# date and time & excel sheet
sheet = wb.active
time_now = datetime.now()  # Rename 'time' to 'time_now' to avoid conflict
arraypointstime = [time_now]
timeanddate = arraypointstime

# frame count
frame_count = 0
desired_frame_size = (1920, 1080)

# Add this global variable
stream_active = True

def generate_frames():
    global stream_active
    cap = cv2.VideoCapture(0)  # Use 0 for webcam, or RTSP URL for IP camera
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 2)  # Set a small buffer size

    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    last_detection_time = datetime.now()
    detection_interval = timedelta(seconds=5)  # 5 seconds between detections
    confidence_threshold = 0.5  # Adjust as needed
    frame_skip = 2  # Process every nth frame

    frame_count = 0

    while stream_active:  # Change this line
        frame_count += 1
        success, frame = cap.read()
        if not success:
            break
        
        if frame_count % frame_skip != 0:
            continue  # Skip this frame

        try:
            current_time = datetime.now()

            # Only run object detection if enough time has passed since last detection
            if current_time - last_detection_time >= detection_interval:
                results = model(frame, stream=True, conf=0.15, max_det=10)
                arraypoints = [0]
                arraypoints2 = [0]

                for result in results:
                    boxes = result.boxes.xyxy.cpu().numpy()
                    confidences = result.boxes.conf.cpu().numpy()
                    class_ids = result.boxes.cls.cpu().numpy()

                    for box, confidence, class_id in zip(boxes, confidences, class_ids):
                        if confidence >= confidence_threshold:
                            x1, y1, x2, y2 = box.astype(int)
                            class_name = result.names[int(class_id)]
                            
                            if class_name == "Human":
                                color = (0, 255, 0)  # Green for humans
                                hpoint1, hpoint2 = (x1, y1), (x2, y2)
                                euclidean_distancehuman = dist.euclidean(hpoint1, hpoint2)
                                humandistance = np.polyval(coffh, euclidean_distancehuman)
                                arraypoints.append(humandistance)
                            elif class_name == "Trash":
                                color = (0, 0, 255)  # Red for trash
                                tpoint1, tpoint2 = (x1, y1), (x2, y2)
                                euclidean_distancetrash = dist.euclidean(tpoint1, tpoint2)
                                trashdistance = np.polyval(cofft, euclidean_distancetrash)
                                arraypoints2.append(trashdistance)
                            else:
                                color = (255, 0, 0)  # Blue for other objects

                            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                            cv2.putText(frame, f"{class_name}: {confidence:.2f}", (x1, y1 - 10),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

                euclihuman = int(np.mean(arraypoints)) if arraypoints else 0
                eudlitrash = int(np.mean(arraypoints2)) if arraypoints2 else 0

                trash_detected = any(cls_id == 1 and conf >= confidence_threshold for cls_id, conf in zip(class_ids, confidences))

                print(f"Trash Detected: {trash_detected}")

                if trash_detected and eudlitrash < euclihuman and euclihuman != 0 and eudlitrash != 0:
                    cosineangle = (eudlitrash / euclihuman)
                    distance_squared = (eudlitrash * 2 + euclihuman * 2) - (2 * eudlitrash * euclihuman) * cosineangle
                    distance = math.sqrt(max(distance_squared, 0))

                    if distance >= 39 and current_time - last_detection_time >= detection_interval:
                        resized_frame = cv2.resize(frame, desired_frame_size)
                        frame_path = os.path.join(OUTPUT_DIR_PATH, f"frame_{frame_count:04d}.jpg")
                        cv2.imwrite(frame_path, resized_frame)
                        
                        # Create TrashAlert
                        image_content = ContentFile(cv2.imencode('.jpg', resized_frame)[1].tobytes(), f"frame_{frame_count:04d}.jpg")
                        TrashAlert.objects.create(frame_image=image_content, location=LOCATION_NAME)
                        
                        # Save time to Excel
                        sheet.append(timeanddate)
                        wb.save(filepathexcel)
                        print("littering")
                        last_detection_time = current_time  # Update last detection time
                        consecutive_detections = 0  # Reset consecutive detections
                        detection_buffer = []  # Clear detection buffer
                    success, buffer = cv2.imencode('.jpg', frame)
                frame = buffer.tobytes()    
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

                time.sleep(0.01)  # This should now work correctly

        except Exception as e:
            print(f"Error processing frame: {e}")
            continue

    cap.release()

def merge_overlapping_boxes(detections, iou_threshold=0.5):
    if not detections:
        return []

    # Sort detections by confidence (descending)
    detections = sorted(detections, key=lambda x: x[1], reverse=True)
    
    merged = []
    while detections:
        best = detections.pop(0)
        merged.append(best)
        
        detections = [d for d in detections if calculate_iou(best[0], d[0]) < iou_threshold]
    
    return merged

def calculate_iou(box1, box2):
    # Calculate intersection over union of two boxes
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])
    
    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    
    iou = intersection / float(area1 + area2 - intersection)
    return iou

def merge_overlapping_boxes(detections, iou_threshold=0.5):
    if not detections:
        return []

    # Sort detections by confidence (descending)
    detections = sorted(detections, key=lambda x: x[1], reverse=True)
    
    merged = []
    while detections:
        best = detections.pop(0)
        merged.append(best)
        
        detections = [d for d in detections if calculate_iou(best[0], d[0]) < iou_threshold]
    
    return merged

def calculate_iou(box1, box2):
    # Calculate intersection over union of two boxes
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])
    
    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    
    iou = intersection / float(area1 + area2 - intersection)
    return iou

def calculate_iou(box1, box2):
    # Calculate intersection over union of two boxes
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])
    
    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    
    iou = intersection / float(area1 + area2 - intersection)
    return iou

def index(request):
    alerts = TrashAlert.objects.all().order_by('-detected_at')[:3]
    
    return render(request, 'index.html', {
        'alerts': alerts,
        'location_name': LOCATION_NAME,
    })

from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@csrf_exempt
@require_http_methods(["GET"])
def video_feed(request):
    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')

def get_alerts(request):
    alerts = TrashAlert.objects.all().order_by('-detected_at')[:5]
    alert_list = [
        {
            'id': alert.id,
            'detected_at': alert.detected_at.strftime('%Y-%m-%d %H:%M:%S'),
            'location': alert.location
        }
        for alert in alerts
    ]
    return JsonResponse({'alerts': alert_list})

def alert_detail(request, alert_id):
    alert = get_object_or_404(TrashAlert, id=alert_id)
    alert_data = {
        'detected_at': alert.detected_at.strftime('%Y-%m-%d %H:%M:%S'),
        'location': alert.location
    }
    return JsonResponse({'alert': alert_data})
@csrf_exempt
def handle_preflight(request):
    response = HttpResponse()
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@csrf_exempt
def stop_streaming(request):
    global stream_active
    if request.method == 'POST':
        stream_active = False
        return JsonResponse({'status': 'success', 'message': 'Streaming stopped'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)