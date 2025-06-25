import './otp.css'

const Otp = ()=>{
    return(
        <div className="otp-page">
            <div className="otp-container">
                <div className="header">
                    <h1>Masukan kode OTP</h1>
                    <p>cek email Anda untuk melihat kode OTP</p>
                </div>

                <div className="input-container">
                    <input type="number" className="input-otp"/>
                </div>
                
                <div className="resend-container">
                    <p className="resend">Belum menerima kode OTP?<a href="#">Kirim ulang</a></p>
                </div>

                <div className="button-container">
                    <div className="button-verif">Verifikasi</div>
                </div>
            </div>

        </div>
    )
}

export default Otp;