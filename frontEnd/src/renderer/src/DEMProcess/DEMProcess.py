import os
from osgeo import gdal
from PIL import Image
import imageio

outputPath = "public/textures/YLWaterHeight/"
inputPath = "public/DEMs/YL/"

if __name__ == "__main__":
    demPaths = os.listdir(inputPath)
    maxValue = 4.0
    for demPath in demPaths:
        # read dem
        dataset = gdal.Open(os.path.join(inputPath, demPath))
        band = dataset.GetRasterBand(1)
        height = band.ReadAsArray()
        rows = dataset.RasterYSize
        cols = dataset.RasterXSize
        # lerp values
        for x in range(rows):
            for y in range(cols):
                height[x, y] = max(0.0, min(height[x, y] / maxValue, 1.0))
        height = (height * 255.0).astype('uint8')
        # output image
        image = Image.fromarray(height)
        imageio.imsave(outputPath + demPath[:-4] + '.png', image)
        print(f"{demPath} has saved as image.")