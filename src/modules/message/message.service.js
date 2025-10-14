import { Message } from "../../db/models/message.model.js";
import { Users } from "../../db/models/user.model.js";
import { messages } from "../../utils/index.js";

//send messages
export const sendMessage = async (req, res, next) => {
  //destruct data from req.body
  const { receiver, sender, content } = req.body;

  //checks if receiver exists
  const receiverExists = await Users.findById(receiver);
  if (!receiverExists) {
    return next(new Error(messages.user.notfound, { cause: 404 }));
  }

  //create message based if the user wants it anonyms or not
  let message;
  let senderExists;
  if (sender) {
    senderExists = await Users.findById(sender);
    if (!senderExists) {
      return next(new Error(messages.user.notfound, { cause: 404 }));
    }
    message = await Message.create({ receiver, content, sender });
  } else {
    message = await Message.create({ receiver, content });
  }

  //send res
  return res.status(201).json({
    success: true,
    message: messages.message.createdSuccessfully,
    data: {
      message,
      senderUserName: sender ? senderExists.userName : null,
    },
  });
};

//get messages
export const getMessages = async (req, res, next) => {
  //get user from isAuthenticate
  const userExists = req.authUser;

  //check if it gets receiver or sender messages
  let msgs;
  if (req.query.flag === "1") {
    msgs = await Message.find({ sender: userExists._id });
  } else {
    msgs = await Message.find({ receiver: userExists._id });
  }

  //checks if user has any messages
  if (msgs.length === 0) {
    return next(new Error(messages.messages.notfound, { cause: 404 }));
  }

  //send res
  return res.status(200).json({
    success: true,
    messages: msgs,
  });
};

//delete message
export const deleteMessage = async (req, res, next) => {
  //get user from isAuthenticate
  const userExists = req.authUser;

  const del = await Message.deleteOne({
    _id: req.params.id,
    $or: [{ receiver: userExists._id }, { sender: userExists._id }],
  });
  if (del.deletedCount === 0) {
    return next(new Error(messages.message.notfound, { cause: 404 }));
  }

  //send res
  return res.status(200).json({
    success: true,
    message: messages.message.deletedSuccessfully,
  });
};
