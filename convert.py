import os
from cairosvg import svg2png

def convert_svgs_to_pngs(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.lower().endswith('.svg'):
            svg_path = os.path.join(input_folder, filename)
            png_filename = os.path.splitext(filename)[0] + '.png'
            png_path = os.path.join(output_folder, png_filename)
            try:
                svg2png(url=svg_path, write_to=png_path)
                print(f'Converted {filename} to {png_filename}')
            except Exception as e:
                print(f'Failed to convert {filename}: {e}')

if __name__ == '__main__':
    input_folder = 'public/assets/shapes'  # Change this to your SVG folder path
    output_folder = 'public/assets/out'      # Change this to your desired output folder
    convert_svgs_to_pngs(input_folder, output_folder)
