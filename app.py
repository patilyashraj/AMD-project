from flask import Flask, request, render_template, redirect, url_for, jsonify
import os
import pandas as pd

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Route for rendering upload form
@app.route("/")
def upload_form():
    return render_template("upload.html")

# Route for handling file upload and CSV processing
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return redirect(request.url)

    file = request.files["file"]
    if file.filename == "":
        return redirect(request.url)

    if file:
        # Save file
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)

        # Process CSV
        df = pd.read_csv(file_path)
        summary = {
            "columns": df.columns.tolist(),
            "missing_values": df.isnull().sum().to_dict(),
            "basic_statistics": df.describe().to_dict(),
        }

        # Saving information in json format and returning it
        return jsonify({"message": f"File {file.filename} uploaded successfully!", "summary": summary})

if __name__ == "__main__":
    app.run(debug=True)
