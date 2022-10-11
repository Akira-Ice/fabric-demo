const { Album } = require("../model");

// 获取所有画布列表
exports.getAll = async (req, res, next) => {
  try {
    let user_id = req.body.user_id;
    console.log(user_id);
    let list = await Album.find({ user_id });
    res.send({ code: 200, data: list, message: "getAll success" });
  } catch (error) {
    res.send({ code: 201, data: "", message: "failed" });
    next(error);
  }
};

// 保存画布
exports.save = async (req, res, next) => {
  try {
    console.log(req.body);
    let album = new Album(req.body);
    let data = await album.save();
    res.send({ code: 200, data, message: "save success" });
  } catch (error) {
    res.send({ code: 201, data: "", message: "save failed" });
    next(error);
  }
};

// 根据id删除画布
exports.removeById = async (req, res, next) => {
  try {
    console.log(req.body._id);
    let data = await Album.findByIdAndRemove(req.body._id);
    res.send({ code: 200, data, message: "remove success" });
  } catch (error) {
    res.send({ code: 201, data: "", message: "remove failed" });
    next(error);
  }
};

// 根据id修改画布
exports.modifyById = async (req, res, next) => {
  try {
    let data = await Album.findByIdAndUpdate(req.body._id, req.body);
    res.send({ code: 200, data, message: "modify success" });
  } catch (error) {
    res.send({ code: 201, data: "", message: "modify failed" });
    next(error);
  }
};
