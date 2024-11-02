import os
from ultralytics import YOLO
# from cvzone.HandTrackingModule import HandDetector
import cv2
from scipy.spatial import distance as dist
import numpy as np
import cvzone
import math
from openpyxl import load_workbook
from datetime import datetime

filepathexcel = r"C:\Users\Jaderick\Desktop\detectionalgo\runs\detect\train2\litter.detect.v91.yolov8\Book1.xlsx"
wb = load_workbook ( filepathexcel )
output_directory = "C:/Users/Jaderick/Desktop/detectionalgo/runs/detect/train2/frames"
os.makedirs(output_directory, exist_ok=True)
model = YOLO ( "C:/Users/Jaderick/Desktop/detectionalgo/runs/detect/train2/weights/18k_openvino_model/18k.pt" )

y = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240]
x1 = [245, 215, 200, 180, 160, 145, 138, 122, 114, 110, 98, 80]
x2 = [940, 933, 877, 804, 738, 678, 621, 568, 522, 479, 444, 406]

coffh = np.polyfit ( x2, y, 2 )
cofft = np.polyfit ( x1, y, 2 )

# date and time & excel sheet
sheet = wb.active
time = datetime.now ()
arraypointstime = [time]
timeanddate = arraypointstime

# frame count
frame_count =0
desired_frame_size = (1920, 1080)
# Initialize the webcam
cap = cv2.VideoCapture ( "C:/Users/Jaderick/Desktop/detectionalgo/runs/detect/train2/Vid of littering 2.mp4" )
fps = int ( cap.get ( cv2.CAP_PROP_FPS ) )

fourcc = cv2.VideoWriter_fourcc ( 'm', 'p', '4', 'v' )
frame_width = int ( cap.get ( cv2.CAP_PROP_FRAME_WIDTH ) )
frame_height = int ( cap.get ( cv2.CAP_PROP_FRAME_HEIGHT ) )

out = cv2.VideoWriter ( 'runs/detect/train2/output.mp4', fourcc, fps, (frame_width, frame_height), True )
# Main loop to continuously get frames from the webcam

while True:
    ret, frame = cap.read ()

    if not ret:
        print ( "Failed to grab frame" )
        break

    # Predict object bounding boxes using YOLO
    results = model.predict ( frame, stream = True, conf = 0.15, max_det = 10 )
    arraypoints = [0]
    arraypoints2 = [0]
    minus = []

    for result in results:
        boxes = result.boxes.cpu ().numpy ()
        for box in boxes:
            humanbox = box.xyxy[0].astype ( int )

            b = str ( result.names[int ( box.cls[0] )] )
            cv2.rectangle ( frame, tuple ( humanbox[:2] ), tuple ( humanbox[2:] ), (0, 0, 0), 5 )
            font = cv2.FONT_HERSHEY_PLAIN
            cv2.putText ( frame, str ( datetime.now () ), (20, 40),
                          font, 2, (0, 255, 0), 2, cv2.LINE_AA )
            cls = int ( box.cls[0] )
            # Calculate the center x and y coordinates for the bounding box and Euclidean distance
            if b == "Human":
                hpoint1 = (humanbox[0], humanbox[1])
                hpoint2 = (humanbox[2], humanbox[3])
                euclidean_distancehuman = dist.euclidean ( hpoint1, hpoint2 )
                A, B, C = coffh
                humandistance = A * euclidean_distancehuman ** +B * euclidean_distancehuman + C
                arraypoints.append ( humandistance )

            if b == "Trash":
                tpoint1 = (humanbox[0], humanbox[1])
                tpoint2 = (humanbox[2], humanbox[3])
                euclidean_distancetrash = dist.euclidean ( tpoint1, tpoint2 )
                X, Y, Z = coffh
                trashdistance = X * euclidean_distancetrash ** +Y * euclidean_distancetrash + Z
                arraypoints2.append ( trashdistance )
                print ( trashdistance, "trashdis" )

        euclihuman = int ( np.mean ( arraypoints ) ) #input into an array
        eudlitrash = int ( np.mean ( arraypoints2 ) )

        #application of LOC
        if eudlitrash < euclihuman and euclihuman != 0 and eudlitrash != 0:
            cosineangle = (eudlitrash / euclihuman)
            distance_squared = (eudlitrash ** 2 + euclihuman ** 2) - (2 * eudlitrash * euclihuman) * cosineangle

            # Ensure that the value inside math.sqrt is non-negative
            distance = math.sqrt ( max ( distance_squared, 0 ) )

            if distance >= 39:
                (cv2.rectangle ( frame, tuple ( humanbox[:2] ), tuple ( humanbox[2:] ), (0, 0, 255), 5 ))
                #out.write ( cv2.rectangle ( frame, tuple ( humanbox[:2] ), tuple ( humanbox[2:] ), (0, 0, 0), 5 ) )
                frame_count +=1
                resized_frame = cv2.resize ( frame, desired_frame_size )
                cv2.rectangle ( resized_frame, tuple ( humanbox[:2] ), tuple ( humanbox[2:] ), (0, 0, 255),5 )  # Red rectangle
                frame_path = os.path.join ( output_directory, f"frame_{frame_count:04d}.jpg" )
                cv2.imwrite ( frame_path, resized_frame )
                # saving time
                data = sheet.append ( timeanddate )
                print ( "littering" )

        if eudlitrash < euclihuman and euclihuman != 0 and eudlitrash != 0:
            cosineangle = (eudlitrash / euclihuman)
            distance_squared = (eudlitrash ** 2 + euclihuman ** 2) - (2 * eudlitrash * euclihuman) * cosineangle

            # Ensure that the value inside math.sqrt is non-negative
            distance = math.sqrt ( max ( distance_squared, 0 ) )
            if distance >= 39:  # equals to 2m
                # detecting
                (cv2.rectangle ( frame, tuple ( humanbox[:2] ), tuple ( humanbox[2:] ), (0, 0, 255), 5 ))
                #out.write ( cv2.rectangle ( frame, tuple ( humanbox[:2] ), tuple ( humanbox[2:] ), (0, 0, 0), 5 ) )
                frame_count += 1
                resized_frame = cv2.resize ( frame, desired_frame_size )
                cv2.rectangle ( resized_frame, tuple ( humanbox[:2] ), tuple ( humanbox[2:] ), (0, 0, 255),5 )  # Red rectangle
                frame_path = os.path.join ( output_directory, f"frame_{frame_count:04d}.jpg" )
                cv2.imwrite ( frame_path, resized_frame )
                out.write ( frame )
                # saving time
                data = sheet.append ( timeanddate )
                print ( "littering" )

    out.write ( frame )
    cv2.imshow ( "Detecting", frame )
    wb.save ( filepathexcel )
    if cv2.waitKey ( 1 ) & 0xFF == ord ( 'x' ):
        wb.save ( filepathexcel )
        out.write ( frame )
        break

# Release the webcam and destroy OpenCV windows
cap.release ()
cv2.destroyAllWindows ()