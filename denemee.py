import csv
import json
import uuid

# CSV dosyasının yolunu belirtin
file_path = r'C:\Users\ibrahim\Downloads\turkey_car_market.csv\turkey_car_market.csv'

# Verileri saklamak için bir liste oluştur
car_data = []

# CSV dosyasını okuyup bilgileri listeye ekle
with open(file_path, mode='r', encoding='utf-8') as file:
    reader = csv.reader(file)
    next(reader)  # Başlık satırını atla
    for row in reader:
        brand = row[1]  # Marka adı
        model = row[2]  # Model
        model_detail = row[3]  # Modelin detayları

        # Mevcut marka varsa, modele detay ekle; yoksa yeni marka oluştur
        brand_entry = next((item for item in car_data if item["brand"] == brand), None)
        if not brand_entry:
            brand_entry = {
                "_id": str(uuid.uuid4()),  # Her marka için benzersiz bir ID oluştur
                "brand": brand,
                "models": {}
            }
            car_data.append(brand_entry)

        # Model daha önce eklenmemişse, yeni bir model girişi yap
        if model not in brand_entry["models"]:
            brand_entry["models"][model] = []

        # Model detayını modele ekle ve tekrarları önle
        if model_detail not in brand_entry["models"][model]:
            brand_entry["models"][model].append(model_detail)

# JSON dosyasına yaz
json_file_path = 'output_cleaned_with_ids.json'
with open(json_file_path, mode='w', encoding='utf-8') as json_file:
    json.dump(car_data, json_file, ensure_ascii=False, indent=4)

print(f"Her markaya ayrı ID'ler atanarak veriler '{json_file_path}' dosyasına yazıldı.")
