const isStatusOk: (status: number) => boolean = (status) =>
  status >= 200 && status < 400

export default isStatusOk
