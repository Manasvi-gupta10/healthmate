🩺 HealthMate

HealthMate is a full-stack healthcare assistance platform designed to help users access medicine information, check possible health conditions based on symptoms, and receive personalized health guidance.

🚀 Features:

Medicine Information-

* Search medicines by name.
* Fetch medicine details using the OpenFDA API.
* View uses, warnings, and safety information.
* Supports brand-to-generic medicine mapping for better search accuracy.

Home Remedies-

* Get home remedy suggestions for common health conditions.
* AI-powered recommendations for custom symptoms.
* Easy-to-understand health guidance.

Symptom Checker-

* Select multiple symptoms.
* Weighted symptom matching algorithm identifies possible health conditions.
* Displays the top 3 most likely conditions with confidence scores.
* Provides AI-generated explanations and recommendations.

Health Guidance-

Based on the most likely condition:

* Condition overview
* Home remedies
* Recommended foods
* Foods to avoid
* When to consult a doctor

Authentication-

* Secure user authentication.
* Personalized user experience.
* Protected routes and session management.

Tech Stack-

Frontend:-

* React.js
* Vite
* JavaScript
* Tailwind CSS

Backend:-

* Node.js
* Express.js

Database:-

* MongoDB

APIs & Services:-

* OpenFDA API
* Groq API



⚙️ Installation

Clone Repository

```bash
git clone https://github.com/Manasvi-gupta10/healthmate.git
cd healthmate
```
Install Dependencies

```bash
npm install

cd frontend
npm install

cd ../backend
npm install
```
 Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

OPENFDA_API_URL=https://api.fda.gov

GROQ_API_KEY=your_groq_api_key
```

Run Project

```bash
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

Backend:

```bash
http://localhost:5000
```

 Future Enhancements

* Health History Tracking
* Appointment Booking Integration
* Emergency Health Alerts

⚠️ Disclaimer

HealthMate is intended for educational and informational purposes only. It does not provide medical diagnosis, treatment, or professional healthcare advice. Users should consult qualified healthcare professionals for medical concerns.

👩‍💻 Author

**Manasvi Gupta**

GitHub: https://github.com/Manasvi-gupta10
