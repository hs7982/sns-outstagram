import React from "react";
import { Link } from "react-router-dom";
import SettingNav from "./SettingNav";

const Tip = () => {
  return (
    <div className="mx-1">
      <div className="row gx-5">
        <SettingNav />

        <div className="col pt-5">
          <Link to="/setting/tip/service" className="text-dark text-decoration-none"><div className="p-1 fs-1">고객 센터 <i class="bi bi-chevron-right"></i></div></Link>

          <Link to="/setting/tip/account" className="text-dark text-decoration-none"><div className="p-1 fs-1">계정 상태 <i class="bi bi-chevron-right"></i></div></Link>
          
          
        </div>
      </div>
    </div>
    
  );
};

export default Tip;