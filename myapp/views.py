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
import time
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse

model_path = 'C:/Users/Jaderick/Desktop/detectionalgo/runs/detect/train2/weights/18k_openvino_model/18k.pt'
model = YOLO(model_path)

cap = cv2.VideoCapture(0)

LOCATION_NAME = "Los Banos, Philippines"

 
def generate_frames():
    frame_interval = 1  # Interval in seconds between each detection check
    last_detection_time = time.time()
    detection_interval = 30  
    confidence_threshold = 0.70  # Increased confidence threshold
    min_detection_count = 5  # Increased minimum number of consecutive detections
    consecutive_detections = 0
    detection_buffer = []
    buffer_size = 10  # Number of frames to consider for consistency

    while True:
        success, frame = cap.read()
        if not success:
            break
        
        try:
            current_time = time.time()
            
            if current_time - last_detection_time >= frame_interval:
                results = model(frame)
                annotated_frame = results[0].plot()
                
                ret, buffer = cv2.imencode('.jpg', annotated_frame)
                if not ret:
                    continue

                image_content = ContentFile(buffer.tobytes(), 'frame.jpg')

                boxes = results[0].boxes.xyxy 
                confidences = results[0].boxes.conf 
                class_ids = results[0].boxes.cls 

                # Filter detections based on confidence and class
                valid_detections = [(box, conf) for box, conf, cls_id in zip(boxes, confidences, class_ids) 
                                    if cls_id == 1 and conf >= confidence_threshold]
                
                # Check for overlapping boxes and merge them
                merged_detections = merge_overlapping_boxes(valid_detections)
                
                detection_buffer.append(len(merged_detections))
                if len(detection_buffer) > buffer_size:
                    detection_buffer.pop(0)
                
                # Check for consistency in detections
                if len(detection_buffer) == buffer_size and all(d > 0 for d in detection_buffer):
                    consecutive_detections += 1
                else:
                    consecutive_detections = 0

                trash_detected = consecutive_detections >= min_detection_count
                
                print(f"Trash Detected: {trash_detected}, Consecutive Detections: {consecutive_detections}, Merged Detections: {len(merged_detections)}")

                if trash_detected:
                    if current_time - last_detection_time >= detection_interval:
                        TrashAlert.objects.create(frame_image=image_content, location=LOCATION_NAME)
                        last_detection_time = current_time  # Update last detection time
                        consecutive_detections = 0  # Reset consecutive detections
                        detection_buffer = []  # Clear detection buffer

                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                
            time.sleep(0.01)

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
    return StreamingHttpResponse(generate(), content_type='multipart/x-mixed-replace; boundary=frame')

def generate():
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        try:
            results = model(frame)
            annotated_frame = results[0].plot()
            
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            if not ret:
                continue

            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
        except Exception as e:
            print(f"Error processing frame: {e}")
            continue

def generate():
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        try:
            results = model(frame)
            annotated_frame = results[0].plot()
            
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            if not ret:
                continue

            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
        except Exception as e:
            print(f"Error processing frame: {e}")
            continue

# Add this new view to handle CORS preflight requests
@csrf_exempt
def handle_preflight(request):
    response = HttpResponse()
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response

def get_alerts(request):
    alerts = TrashAlert.objects.all().order_by('-detected_at')[:5]
    alert_list = [
        {
            'detected_at': localtime(alert.detected_at).strftime('%Y-%m-%d %H:%M:%S'),
            'location': alert.location
        }
        for alert in alerts
    ]
    return JsonResponse({'alerts': alert_list})

def alert_detail(request, alert_id):
    alert = get_object_or_404(TrashAlert, id=alert_id)
    return render(request, 'alert_detail.html', {'alert': alert})
    
# cap = cv2.VideoCapture('rtsp://admin:sample@192.168.0.1')
