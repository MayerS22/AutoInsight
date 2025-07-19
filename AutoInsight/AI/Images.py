import requests
import os
import zipfile
from urllib.parse import urlparse

# List of all image URLs from the JSON
image_urls = {
    "pie_chart": [
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238828/analysis/analysis_1747238703400_0.png",
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238828/analysis/analysis_1747238704542_1.png",
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238829/analysis/analysis_1747238705308_2.png"
    ],
    "bar_chart": [
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238830/analysis/analysis_1747238706214_0.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238831/analysis/analysis_1747238706923_1.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238833/analysis/analysis_1747238707914_2.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238834/analysis/analysis_1747238709999_3.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238835/analysis/analysis_1747238710868_4.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238836/analysis/analysis_1747238711793_5.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238836/analysis/analysis_1747238712620_6.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238837/analysis/analysis_1747238713299_7.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238838/analysis/analysis_1747238714050_8.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238839/analysis/analysis_1747238715102_9.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238840/analysis/analysis_1747238715878_10.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238841/analysis/analysis_1747238716753_11.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238842/analysis/analysis_1747238717694_12.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238842/analysis/analysis_1747238718418_13.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238843/analysis/analysis_1747238719234_14.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238844/analysis/analysis_1747238719940_15.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238845/analysis/analysis_1747238721153_16.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238846/analysis/analysis_1747238722070_17.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238847/analysis/analysis_1747238723092_18.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238848/analysis/analysis_1747238723797_19.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238849/analysis/analysis_1747238724627_20.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238849/analysis/analysis_1747238725471_21.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238851/analysis/analysis_1747238726347_22.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238851/analysis/analysis_1747238727491_23.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238852/analysis/analysis_1747238728462_24.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238853/analysis/analysis_1747238729347_25.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238854/analysis/analysis_1747238730577_26.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238855/analysis/analysis_1747238731282_27.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238856/analysis/analysis_1747238732162_28.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238857/analysis/analysis_1747238733030_29.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238858/analysis/analysis_1747238734050_30.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238859/analysis/analysis_1747238734973_31.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238860/analysis/analysis_1747238735714_32.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238860/analysis/analysis_1747238736687_33.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238861/analysis/analysis_1747238737361_34.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238862/analysis/analysis_1747238738245_35.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238863/analysis/analysis_1747238739225_36.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238864/analysis/analysis_1747238739816_37.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238865/analysis/analysis_1747238740910_38.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238866/analysis/analysis_1747238741641_39.png", "filterNumber": 20}
    ],
    "kde": [
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238892/analysis/analysis_1747238768045_0.png",
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238892/analysis/analysis_1747238768658_1.png",
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238893/analysis/analysis_1747238769551_2.png",
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238894/analysis/analysis_1747238770443_3.png",
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238895/analysis/analysis_1747238771198_4.png",
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238896/analysis/analysis_1747238771995_5.png",
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238897/analysis/analysis_1747238772810_6.png"
    ],
    "histogram": [
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238866/analysis/analysis_1747238742609_0.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238867/analysis/analysis_1747238743455_1.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238868/analysis/analysis_1747238744150_2.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238869/analysis/analysis_1747238744780_3.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238869/analysis/analysis_1747238745512_4.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238870/analysis/analysis_1747238746322_5.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238871/analysis/analysis_1747238747004_6.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238872/analysis/analysis_1747238747681_7.png", "filterNumber": 5},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238872/analysis/analysis_1747238748387_8.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238873/analysis/analysis_1747238749068_9.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238874/analysis/analysis_1747238749846_10.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238874/analysis/analysis_1747238750568_11.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238875/analysis/analysis_1747238751274_12.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238876/analysis/analysis_1747238751990_13.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238877/analysis/analysis_1747238752759_14.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238877/analysis/analysis_1747238753398_15.png", "filterNumber": 10},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238878/analysis/analysis_1747238754049_16.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238879/analysis/analysis_1747238754827_17.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238879/analysis/analysis_1747238755635_18.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238880/analysis/analysis_1747238756621_19.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238881/analysis/analysis_1747238757278_20.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238882/analysis/analysis_1747238758401_21.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238883/analysis/analysis_1747238759179_22.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238884/analysis/analysis_1747238759942_23.png", "filterNumber": 15},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238885/analysis/analysis_1747238760698_24.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238885/analysis/analysis_1747238761388_25.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238886/analysis/analysis_1747238762530_26.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238887/analysis/analysis_1747238763346_27.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238888/analysis/analysis_1747238764131_28.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238889/analysis/analysis_1747238764885_29.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238890/analysis/analysis_1747238765926_30.png", "filterNumber": 20},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238891/analysis/analysis_1747238766633_31.png", "filterNumber": 20}
    ],
    "correlation": [
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238898/analysis/analysis_1747238773772_0.png"
    ],
    "forecast": [
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238899/analysis/analysis_1747238774827_0.png", "filterNumber": 6},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238900/analysis/analysis_1747238775867_1.png", "filterNumber": 6},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238902/analysis/analysis_1747238778143_2.png", "filterNumber": 9},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238903/analysis/analysis_1747238779143_3.png", "filterNumber": 9},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238904/analysis/analysis_1747238780029_4.png", "filterNumber": 12},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238907/analysis/analysis_1747238781202_5.png", "filterNumber": 12},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238916/analysis/analysis_1747238792028_6.png", "filterNumber": 18},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238917/analysis/analysis_1747238793041_7.png", "filterNumber": 18},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238918/analysis/analysis_1747238793890_8.png", "filterNumber": 24},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238919/analysis/analysis_1747238794671_9.png", "filterNumber": 24},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238920/analysis/analysis_1747238795725_10.png", "filterNumber": 36},
        {"url": "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238921/analysis/analysis_1747238796657_11.png", "filterNumber": 36}
    ],
    "others": [
        "https://res.cloudinary.com/dwd6kau8a/image/upload/v1747238923/analysis/analysis_1747238797811_0.png"
    ]
}

# Create a directory to store the images
output_dir = "walmart_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Function to download an image from a URL
def download_image(url, file_path):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Downloaded: {file_path}")
        else:
            print(f"Failed to download: {url} (Status code: {response.status_code})")
    except Exception as e:
        print(f"Error downloading {url}: {str(e)}")

# Download all images
for category, urls in image_urls.items():
    for idx, item in enumerate(urls):
        # Handle both dictionary and string formats
        if isinstance(item, dict):
            url = item["url"]
            filter_number = item["filterNumber"]
            file_name = f"{category}_filter_{filter_number}_{idx}.png"
        else:
            url = item
            file_name = f"{category}_{idx}.png"

        # Parse the URL to ensure it's valid
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            print(f"Invalid URL skipped: {url}")
            continue

        file_path = os.path.join(output_dir, file_name)
        download_image(url, file_path)

# Create a ZIP file containing all downloaded images
zip_file_name = "walmart_images.zip"
with zipfile.ZipFile(zip_file_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, _, files in os.walk(output_dir):
        for file in files:
            file_path = os.path.join(root, file)
            zipf.write(file_path, file)
            print(f"Added to ZIP: {file_path}")

print(f"All images have been downloaded and zipped into: {zip_file_name}")