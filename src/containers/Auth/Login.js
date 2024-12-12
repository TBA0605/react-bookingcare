import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";

import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";
import { reject } from "lodash";

class Login extends Component {
  //khai báo các state
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "", //để lưu thông tin lỗi mà api trả về
    };
  }

  handleOnChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  handleOnChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });
    try {
      let data = await handleLoginApi(this.state.username, this.state.password);  //data từ server xử lý xong gửi qua client
      //nếu có lỗi thì show lỗi
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      //không có lỗi thì dùng redux để lưu thông tin user
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
        console.log("Login succeeds");
      }

    } catch (error) {
      if(error.response){
        if(error.response.data){
          this.setState({
            errMessage:error.response.data.message
          })
        }
      }
    }
    console.log(
      "username: ",
      this.state.username,
      " password: ",
      this.state.password
    );
    console.log("all state: ", this.state);
  };

  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  render() {
    //hàm return luôn return ra một khối, nếu 2 khối trở lên sẽ bị lỗi
    //code html thuần thì dùng class, còn với react thì className
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content row">
            <div className="col-12 text-login">Login</div>
            <div className="col-12 form-group login-input">
              <label>Username:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={(event) => this.handleOnChangeUsername(event)}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>Password:</label>
              <div className="custom-input-password">
                <input
                  type={this.state.isShowPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  onChange={(event) => this.handleOnChangePassword(event)}
                />
                <span onClick={() => this.handleShowHidePassword()}>
                  <i
                    className={
                      this.state.isShowPassword
                        ? "far fa-eye"
                        : "far fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>
            <div className="col-12" style={{color:'red'}}>
              {this.state.errMessage}
            </div>
            <div className="col-12">
              <button className="btn-login" onClick={() => this.handleLogin()}>
                Login
              </button>
            </div>
            <div className="col-12">
              <span className="forgot-password">Forgot your password?</span>
            </div>
            <div className="col-12 text-center mt3">
              <span className="text-other-login">Or Login With</span>
            </div>
            <div className="col-12 social-login">
              <i className="fab fa-google-plus-g google"></i>
              <i className="fab fa-facebook-f facebook"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
    //adminLoginFail: () => dispatch(actions.adminLoginFail()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
