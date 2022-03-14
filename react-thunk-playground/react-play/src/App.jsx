import { useState, createContext, useContext, useEffect } from "react";
import { appContext, store, connect } from "./redux";

const App = () => {
  return (
    <appContext.Provider value={store}>
      <大儿子 />
      <二儿子 />
      <幺儿子 />
    </appContext.Provider>
  );
};
const 大儿子 = () => {
  console.log("大儿子运行了");
  return (
    <section>
      大儿子
      <User />
    </section>
  );
};
const 二儿子 = () => {
  console.log("二儿子运行了");
  return (
    <section>
      二儿子
      <UserModifier>chilren</UserModifier>
    </section>
  );
};
const 幺儿子 = connect((state) => {
  return { group: state.group };
})(({ group }) => {
  console.log("幺儿子运行了");
  return <section>幺儿子:{group.name}</section>;
});

const useSelector = (state) => {
  return { user: state.user };
};

const userDispatcher = (dispatch) => {
  return {
    updateUser: (attrs) =>
      dispatch({
        type: "updateUser",
        payload: attrs,
      }),
  };
};

const User = connect(useSelector)(({ user }) => {
  console.log("User子运行了");

  return <div>User:{user.name}</div>;
});

const UserModifier = connect(
  useSelector,
  userDispatcher
)(({ updateUser, user, children }) => {
  console.log("UserModifier子运行了");

  const onChange = (e) => {
    // 怎么能改变原始state呢， 所以改reducer
    // contextValue.appState.user.name = e.target.value;
    updateUser({ name: e.target.value });
  };
  return (
    <div>
      {children}
      <input value={user.name} onChange={onChange} />
    </div>
  );
});

export default App;
