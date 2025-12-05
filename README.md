# **AI-Based Emergency Keyword Detection System**

### *Hands-free safety tool for real-time distress detection and automated alerts*

## **Overview**

The **AI-Based Emergency Keyword Detection System** is a safety-focused application designed to detect spoken emergency keywords—such as **“aurora”** or **“help”**—and automatically alert trusted contacts with the user’s **real-time location**.
It serves as a **hands-free emergency trigger**, especially useful for women’s safety or situations where physically unlocking a device or pressing a button is not possible.

The system continuously listens in the background, identifies distress keywords using a trained machine-learning model, and instantly sends alerts via SMS or calls through the backend.

---

## **Key Features**

* 🎤 **Continuous voice monitoring** via on-device or browser-based audio streaming
* 🤖 **Machine learning–powered keyword detection** with high accuracy
* 🚨 **Automatic emergency alerts** sent to trusted contacts
* 📍 **Location sharing** included in the alert
* 🔐 **Privacy-first design** (no audio stored unless explicitly enabled)
* 📱 **User-friendly website/app interface**
* 👤 Manage **emergency contacts**, enable/disable listening, view alert history
* ⚡ **Real-time response** even when the phone is locked or hands-free

---

## **System Architecture**

### **1. Audio Collection & Preprocessing**

* Collect speech samples containing the emergency keywords and non-keyword background noise
* Clean and normalize audio clips
* Extract features such as **MFCC**, **spectrograms**, and **mel-frequency features**
* Split into training, validation, and test sets

### **2. Machine Learning Model**

* Model types supported:

  * CNN-based audio classifier
  * RNN/LSTM models for sequential audio
  * Transformer-based audio recognition
* Trained to distinguish emergency keywords vs. background noise
* Exported as a lightweight model suitable for real-time inference (TensorFlow Lite / ONNX)

### **3. Frontend + Backend Integration**

* **Frontend (Web/App):**

  * Start/stop continuous listening
  * Manage emergency contacts
  * Display detection status
  * Trigger manual emergency alert

* **Backend (Server):**

  * Perform real-time inference OR receive detection results from local device
  * Send SMS via Twilio / similar API
  * Provide geolocation data
  * Handle user accounts and alert logs

---

## **Tech Stack**

* **Frontend:** React / HTML / JS / Flutter (depending on your build)
* **Backend:** Node.js / Python Flask / Django
* **ML Model:** TensorFlow / PyTorch
* **Database:** Firebase / MongoDB / PostgreSQL
* **Alert System:** Twilio API / SMS Gateway
* **Audio Processing:** Librosa, PyDub, WebAudio API

---

## **How It Works**

1. User enables *Listening Mode*
2. App continuously processes small audio chunks (1–2 sec)
3. Audio is fed into the ML keyword-detection model
4. If keyword detected:

   * Backend receives detection event
   * Fetches user location
   * Sends SMS/call alerts to saved contacts
5. Contacts receive the message with **time, location, and emergency note**

---

## **Project Structure**

```
/model
  ├── data/  
  ├── training_scripts/  
  └── exported_model/  

/frontend
  ├── components/
  ├── pages/
  └── services/

/backend
  ├── routes/
  ├── controllers/
  └── utils/

README.md
```

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-repo/emergency-keyword-detection.git
cd emergency-keyword-detection
```

### **2. Install Dependencies**

#### Backend

```bash
cd backend
npm install   # or: pip install -r requirements.txt
```

#### Frontend

```bash
cd frontend
npm install
```

### **3. Run ML Model (Local Inference)**

```bash
python model/run_inference.py
```

### **4. Start Development Servers**

Frontend:

```bash
npm start
```

Backend:

```bash
npm run dev
```

---

## **Usage**

* Open the app/website
* Log in and set up your list of trusted contacts
* Enable **Listening Mode**
* Say your emergency keyword if you are in danger
* The system automatically sends help with your location

---

## **Security & Privacy**

* Audio is processed locally unless cloud inference is enabled
* No continuous recordings stored
* Contacts data encrypted in database
* Only emergency events are logged

---

## **Future Enhancements**

* Add wake-word personalization
* Multi-language keyword support
* Integration with wearable devices
* Silent mode alert triggers (vibration pattern recognition)
* On-device inference for low battery usage

---

## **Contributing**

Pull requests and improvements are welcome!
Please open an issue to discuss new ideas or bug reports.

---
