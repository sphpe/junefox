export default function setState(key) {
  return function(data,cb) {
    return function(dispatch) {
      dispatch({
        type: "state_set",
        key: key,
        data: data,
        cb: cb
      })
    }
  }
}