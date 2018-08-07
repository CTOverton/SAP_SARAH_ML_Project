from PIL import Image
import os
import configparser

# Crop -----------------------------------
# This function crops the given image into 9 custom crops
# imgFile: The actual image file
# lnX: The list of x positions for horizontal bounds
# lnY: The list of y positions for vertical bounds
# exportPath: The path to the export directory
# ----------------------------------------


def crop(imgFile, lnX, lnY, exportPath, batchName):
    imgSource = Image.open(imgFile.filename)  # Open the image source
    print("Cropping Source: ")
    print(imgSource)
    imgName = os.path.splitext(os.path.basename(imgFile.filename))[0]
    print("Image name: " + imgName)

    # Rotate 180
    # imgSource = imgSource.rotate(180)

    for i in range(3):  # Loop for rows
        for j in range(3):  # Loop for cols
            imgHeight = int(lnY[i + 1]) - int(lnY[i])  # Define the height of specific crop
            imgWidth = int(lnX[j + 1]) - int(lnX[j])  # Define the width of specific crop

            # Set crop bounds [aka box] (LeftEdgeX, TopEdgeY,RightEdgeX, BottomEdgeY)
            box = (int(lnX[j]), int(lnY[i]), int(lnX[j + 1]), int(lnY[i + 1]))

            # Create new image with crop
            img = Image.new('RGB', (imgWidth, imgHeight), 255)  # (mode, (width, height), color)
            img.paste(imgSource.crop(box))  # apply crop to new image

            # Export file
            sectionName = str(i) + str(j)  # Name by rows and cols (ex: 00, 01, 02, 10, 11, 12)
            imgFileName = imgName + "_" + batchName + "_" + sectionName

            exportDir = '{}\{}'.format(exportPath, sectionName)
            if not os.path.exists(exportDir):
                os.makedirs(exportDir)

            path = os.path.join(exportDir, "%s.png" % imgFileName)  # Joins specified path with file name
            img.save(path)  # Saves the image to specified path
            print('Saved {} to dir {}'.format(imgFileName, sectionName))

    print('---------- Completed {}'.format(imgFileName))


def load_images_from_folder(folder):
    images = []
    for filename in os.listdir(folder):
        if (filename.endswith(".jpg") or filename.endswith(".JPG") or filename.endswith(".png")):
        # if (filename.endswith(".JPG")):
            img = Image.open(os.path.join(folder, filename))
            if img is not None:
                images.append(img)
    return images


def batch(sourceDir, exportDir, batchName):
    config = configparser.ConfigParser()
    config.read(sourceDir + '/config.ini')

    lnX1 = config['VerticalXValues']['lnX1']
    lnX2 = config['VerticalXValues']['lnX2']
    lnX3 = config['VerticalXValues']['lnX3']
    lnX4 = config['VerticalXValues']['lnX4']

    lnY1 = config['HorizontalYValues']['lnY1']
    lnY2 = config['HorizontalYValues']['lnY2']
    lnY3 = config['HorizontalYValues']['lnY3']
    lnY4 = config['HorizontalYValues']['lnY4']

    # Place bound values into lists
    lnX = [lnX1, lnX2, lnX3, lnX4]
    lnY = [lnY1, lnY2, lnY3, lnY4]

    print("Loading " + batchName + " config: ")
    print(lnX)
    print(lnY)

    # Create a list of source images
    imgFiles = []
    imgFiles.extend(load_images_from_folder(sourceDir))  # Get all images from source directory

    # Loop for all images
    for c, value in enumerate(imgFiles):  # c is the loop count, img is the image from the list
        print(c, value)  # Display current Image in progress
        crop(value, lnX, lnY, exportDir, batchName)  # crop method to crop and export sections


if __name__ == '__main__':
    # Config
    # ----------------------------------------
    # sourceDir: the directory to pull source images from
    # exportDir: the directory to export the cropped images to
    # lnX: x positions for horizontal bounds
    # lnY: y positions for vertical bounds
    # ----------------------------------------
    # sourceDir = '/Users/I870033/OneDrive - SAP SE/Projects/SAP_SARAH_ML/Training/Test1_Source/'
    # exportDir = '/Users/I870033/OneDrive - SAP SE/Projects/SAP_SARAH_ML/Training/Test1_Export/'

    sourceDir = '/Users/I870033/SAP SE/MaxAttention Innovation Sarah M L - Documents/Programming/Training/Test1_Source/'
    exportDir = '/Users/I870033/SAP SE/MaxAttention Innovation Sarah M L - Documents/Programming/Training/Test1_Export/'


    # lnX1 = 240
    # lnX2 = 1026
    # lnX3 = 1909
    # lnX4 = 2706
    #
    # lnY1 = 334
    # lnY2 = 876
    # lnY3 = 1382
    # lnY4 = 1862
    # ----------------------------------------

    # Create a list of batches
    batches = []
    # batches.extend(glob.glob(sourceDir))  # Get all batch folders from source directory
    batchNames = []
    batchNames.extend(next(os.walk(sourceDir + '.'))[1])

    for x in range(len(batchNames)):
        print("Processing: " + batchNames[x])
        batch(sourceDir + batchNames[x], exportDir, batchNames[x])
        print("========================================")
    #
    # print(batches)
    #
    # # Loop for all batches
    # for c, batchFolder in enumerate(batches):  # c is the loop count, batchFolder is the batch folder from the list
    #     print(c, batchFolder)  # Display current Image in progress
    #     batch(batchFolder, exportDir)