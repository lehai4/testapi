import { useState } from "react";
import "./App.css";

function App() {
  const url = "https://test.vietlonghung.com.vn";
  const [profile, setProfile] = useState<any>();
  const [matKhau, setMatKhau] = useState<string>("");
  const [matKhauNew, setMatKhauNew] = useState<string>("");
  const [maNV, setMaNV] = useState<string>("");
  const [session, setSession] = useState<any>();
  const [res, setRes] = useState<any>(null);
  const [dataLogin, setDataLogin] = useState<any>();
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const data = { MaNV: maNV, MatKhau: matKhau };
    console.log("data", data);
    try {
      const response = await fetch(url + "/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setMatKhau("");
        setMaNV("");
        setSession(result.data.session);
        console.log(result.data.session);
      }
      setDataLogin(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProfile = async () => {
    console.log("session", session);
    const res = await fetch(url + "/v1/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + ` ${session?.sessionId}`,
      },
      credentials: "include",
    });
    const profile = await res.json();
    setProfile(profile);
  };

  const handleUpdate = async (e: any) => {
    const data = { currentPassword: matKhau, newPassword: matKhauNew };

    e.preventDefault();

    try {
      const response = await fetch(url + "/v1/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + ` ${session?.sessionId}`,
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setMatKhau("");
        setMatKhauNew("");
      }
      setRes(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const LogOut = async () => {
    const res = await fetch(url + "/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + ` ${session?.sessionId}`,
      },
      credentials: "include",
    });
    const result = await res.json();
    setRes(result);
  };

  return (
    <div className="card">
      <form onSubmit={!isUpdated ? handleLogin : handleUpdate}>
        {!isUpdated ? (
          <>
            <h5>Đăng Nhập</h5>
            <div className="form-control" id="">
              <input
                value={maNV}
                placeholder="MaNV..."
                onChange={(e) => setMaNV(e.target.value)}
              />
            </div>
            <div className="form-control" id="">
              <input
                value={matKhau}
                placeholder="MatKhau..."
                onChange={(e) => setMatKhau(e.target.value)}
              />
            </div>
            <button type="submit" style={{ margin: "20px 0" }}>
              Login
            </button>
          </>
        ) : (
          <>
            <h5>Cập nhật</h5>
            <div className="form-control" id="">
              <input
                value={matKhau}
                placeholder="MatKhau..."
                onChange={(e) => setMatKhau(e.target.value)}
              />
            </div>
            <div className="form-control" id="">
              <input
                value={matKhauNew}
                placeholder="MatKhau Moi..."
                onChange={(e) => setMatKhauNew(e.target.value)}
              />
            </div>
            <button type="submit" style={{ margin: "20px 0" }}>
              Update
            </button>
          </>
        )}
      </form>
      <div style={{ display: "flex", flexDirection: "row", columnGap: "24px" }}>
        <button
          style={{ margin: "20px 0" }}
          onClick={() => setIsUpdated(false)}
        >
          Login
        </button>

        <button style={{ margin: "20px 0" }} onClick={() => setIsUpdated(true)}>
          Update Password
        </button>
        <button style={{ margin: "20px 0" }} onClick={handleProfile}>
          Profile
        </button>
        <button
          className="logout"
          style={{ margin: "20px 0" }}
          onClick={LogOut}
        >
          LOGOUT
        </button>
      </div>

      {res && <p>Thông báo: {res.message}</p>}
      {dataLogin && (
        <p style={{ color: "red" }}>Thông báo login: {dataLogin.message}</p>
      )}

      {profile?.success === true ? (
        <>
          <p className="notification" style={{ color: "blue" }}>
            {profile.message}
          </p>
          <h4>Thông Tin Nhân Viên</h4>
          <div
            className="profile"
            style={{
              margin: "20px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>MaNV:{profile.nhanVien.MaNV}</div>
            <div>MaNV:{profile.nhanVien.TenNV}</div>
            <div>CCCD:{profile.nhanVien.CCCD}</div>
            <div>Điện thoại:{profile.nhanVien.DienThoai}</div>
            <div>Công Việc Phụ Trách:{profile.nhanVien.CongViecPhuTrach}</div>
            <div>
              Trạng thái hoạt động:
              {!profile.nhanVien.IsActive ? "Hoạt động" : "Đang nghỉ việc"}
            </div>
          </div>
        </>
      ) : (
        <h3 style={{ color: "red" }}>Lỗi profile:{profile?.message}</h3>
      )}
    </div>
  );
}

export default App;
