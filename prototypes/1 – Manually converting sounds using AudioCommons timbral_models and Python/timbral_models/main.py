import json
import os
from pathlib import Path

import timbral_models

script_directory_path = Path(__file__).resolve().parent
input_directory_path = os.path.join(script_directory_path, 'mock_sounds')

file_names = os.listdir(input_directory_path)
for file_name in file_names:
    print(f"Analyzing {file_name}")
    result = timbral_models.timbral_extractor(
        os.path.join(input_directory_path, file_name),
        clip_output=True
    )

    output_directory_path = os.path.join(
        script_directory_path, './timbral_characteristics')
    if not os.path.exists(output_directory_path):
        os.makedirs(output_directory_path)

    file_path = os.path.join(
        output_directory_path,
        f"{Path(file_name).resolve().stem}.json"
    )
    with open(file_path, "w") as file:
        json.dump(result, file)
        print(f"Result written to {file_path}")
