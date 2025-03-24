import { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "./App.css"; // Import file CSS
import { Capacitor } from "@capacitor/core";

function MyComponent() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [photo, setPhoto] = useState(null);

  // Yêu cầu quyền thông báo
  const requestNotificationPermission = async () => {
    const { display } = await LocalNotifications.requestPermissions();
    return display === "granted";
  };

  // Yêu cầu quyền camera
  const requestCameraPermission = async () => {
    const { camera } = await Camera.requestPermissions();
    return camera === "granted";
  };
  

  const calculateBMI = async () => {
    if (!weight || !height) {
      alert("Vui lòng nhập đầy đủ chiều cao và cân nặng!");
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const calculatedBmi = (
      parseFloat(weight) /
      (heightInMeters * heightInMeters)
    ).toFixed(2);
    setBmi(calculatedBmi);

    let result = "";
    let statusClass = "";

    if (calculatedBmi < 18.5) {
      result = "Gầy";
      statusClass = "underweight";
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 24.9) {
      result = "Bình thường";
      statusClass = "normal";
    } else if (calculatedBmi >= 25 && calculatedBmi < 29.9) {
      result = "Thừa cân";
      statusClass = "overweight";
    } else {
      result = "Béo phì";
      statusClass = "obese";
    }

    setStatus({ text: result, className: statusClass });

    //  Kiểm tra quyền thông báo trước khi gửi thông báo
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Kết quả BMI",
            body: `Chỉ số BMI của bạn là ${calculatedBmi} - ${result}`,
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) },
          },
        ],
      });
    } else {
      alert(
        "Bạn chưa cấp quyền thông báo. Hãy vào cài đặt và bật quyền thông báo cho ứng dụng."
      );
    }
  };

  const shareResult = async () => {
    if (bmi !== null) {
      await Share.share({
        title: "Chia sẻ kết quả BMI",
        text: `Chỉ số BMI của tôi là ${bmi} - ${status.text}. Hãy kiểm tra BMI của bạn ngay!`,
        url: "https://your-app-url.com",
        dialogTitle: "Chia sẻ kết quả của bạn",
      });
    }
  };

const takePhoto = async () => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      alert("Bạn chưa cấp quyền camera. Hãy vào cài đặt và bật quyền.");
      return;
    }

    const image = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      saveToGallery: true, // Lưu vào thư viện (chỉ hoạt động trên Android 11+ nếu có quyền)
    });

    setPhoto(image.webPath);
    alert("Chụp ảnh thành công!");
  } catch (error) {
    console.error("Lỗi chụp ảnh:", error);
    alert(`Lỗi: ${error.message}`);
  }
};



  return (
    <div className="container">
      <h1>Ứng dụng tính BMI</h1>
      <input
        type="number"
        placeholder="Nhập cân nặng (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <input
        type="number"
        placeholder="Nhập chiều cao (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <button onClick={calculateBMI}>Tính BMI</button>

      {bmi !== null && (
        <div className="result">
          <h2>Chỉ số BMI: {bmi}</h2>
          <h3 className={`bmi-status ${status.className}`}>{status.text}</h3>
          <button onClick={shareResult}>Chia sẻ kết quả</button>
        </div>
      )}

      <button onClick={takePhoto}>Chụp ảnh</button>
      {photo && <img src={photo} alt="Ảnh đã chụp" />}
    </div>
  );
}

export default MyComponent;
