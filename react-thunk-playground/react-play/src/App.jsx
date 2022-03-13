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

const User = connect((state) => {
  return { sss: state.user };
})(({ sss }) => {
  console.log("User子运行了");

  return <div>User:{sss.name}</div>;
});

const UserModifier = connect()(({ dispatch, state, children }) => {
  console.log("UserModifier子运行了");

  const onChange = (e) => {
    // 怎么能改变原始state呢， 所以改reducer
    // contextValue.appState.user.name = e.target.value;
    dispatch({
      type: "updateUser",
      payload: { name: e.target.value },
    });
  };
  return (
    <div>
      {children}
      <input value={state.user.name} onChange={onChange} />
    </div>
  );
});

export default App;
