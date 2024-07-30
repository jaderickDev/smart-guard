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


# Load the YOLO model
model_path = 'C:/Users/admin/Downloads/18k.pt'
model = YOLO(model_path)

cap = cv2.VideoCapture(0)

LOCATION_NAME = "Los Banos, Philippines"


def generate_frames():
    frame_interval = 1  # Interval in seconds between each detection check
    last_detection_time = time.time()
    detection_interval = 30  
    confidence_threshold = 0.50  

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

                # Extract detection data
                boxes = results[0].boxes.xyxy  # Box coordinates in [x1, y1, x2, y2]
                confidences = results[0].boxes.conf  # Confidence scores
                class_ids = results[0].boxes.cls  # Class IDs

                # Check for trash with class ID 1 and confidence threshold
                trash_detected = any(cls_id == 1 and conf >= confidence_threshold for cls_id, conf in zip(class_ids, confidences))
                
                # Debugging information
                print(f"Trash Detected: {trash_detected}")

                if trash_detected:
                    if current_time - last_detection_time >= detection_interval:
                        TrashAlert.objects.create(frame_image=image_content, location=LOCATION_NAME)
                        last_detection_time = current_time  # Update last detection time

                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                
            time.sleep(0.01)

        except Exception as e:
            print(f"Error processing frame: {e}")
            continue

    cap.release()

def index(request):
    alerts = TrashAlert.objects.all().order_by('-detected_at')[:3]
    
    return render(request, 'index.html', {
        'alerts': alerts,
        'location_name': LOCATION_NAME,
    })

def video_feed(request):
    return StreamingHttpResponse(generate_frames(),
                                 content_type='multipart/x-mixed-replace; boundary=frame')

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

# cap = cv2.VideoCapture('rtsp://admin:elbiWATCH2019@192.22.0.148')