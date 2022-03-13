import { useState, createContext, useContext, useEffect } from "react";

export const store = {
  state: {
    user: { name: "sdf", age: 18 },
    group: { name: "sss" },
  },
  setState(newState) {
    this.state = newState;
    this.listenrs.map((fn) => fn(this.state));
  },
  listenrs: [],
  subscribe(fn) {
    store.listenrs.push(fn);
    return () => {
      const index = this.listenrs.indexOf(fn);
      this.listenrs.splice(index, 1);
    };
  },
};

const reducer = (state, { type, payload }) => {
  if (type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

const changed = (oldData, newData) => {
  let changed = false;
  for (let key in oldData) {
    if (oldData[key] !== newData[key]) {
      changed = true;
    }
  }
  return changed;
};

// 高阶组件
// 返回一个函数式组件， 包裹住组件
export const connect = (selector) => (Component) => {
  return (props) => {
    const contextValue = useContext(appContext);
    // 刷新视图函数
    const [, update] = useState({});
    const data = selector
      ? selector(contextValue.state)
      : { state: contextValue.state };

    useEffect(() => {
      return contextValue.subscribe(() => {
        // 为什么这里是newData
        // 因为这个订阅函数  是只有dispatch的时候才会触发的函数
        // dispatch以后数据就会发生变化
        // 能不能用useContext?
        const newData = selector
          ? selector(store.state)
          : { state: store.state };
        if (changed(data, newData)) {
          update({});
        }
      });
      // why need
      //useEffect 用到了来自属性的东西  都要加依赖
    }, [selector]);

    const dispatch = (action) => {
      contextValue.setState(reducer(contextValue.state, action));
    };

    return <Component {...props} dispatch={dispatch} {...data} />;
  };
};

export const appContext = createContext(null);
