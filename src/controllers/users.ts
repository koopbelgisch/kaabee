import { Request, Response } from "express";
import { User } from "../models/user";

/**
 * GET /users/
 * A list of all users.
 */
export async function index(req: Request, res: Response): Promise<void> {
  res.render("users/index", {
    title: "KaaBee",
    userCount: await User.count(),
    users: await User.find(),
  });
}

/**
 * GET /users/:userId/
 * Show a single user.
 */
export async function show(req: Request, res: Response): Promise<void> {
  const user = await User.findOne(req.params["userId"]);
  if (user !== undefined) {
    res.render("users/show", {
      user: user
    });
  } else {
    res.status(404);
    res.send("Not found");
  }
}
