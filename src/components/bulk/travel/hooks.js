//定义hooks函数定义data 复用性强
// ADULT("ADULT", "成人"),
// CHILD("CHILD", "儿童");
export const travlerTypeList = () => {
  return [
    {
      label: "成人",
      value: "ADULT"
    },
    {
      label: "儿童",
      value: "CHILD"
    }
  ];
};

//证件类型
export const cerTypeList = () => {
  return [
    {
      label: "身份证",
      value: "ID"
    }
  ];
};
