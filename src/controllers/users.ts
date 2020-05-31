import { Request, Response } from "express";
import { User } from "../models/user";

/**
 * GET /users/
 * A list of all users.
 */
export async function index(req: Request, res: Response): Promise<void> {
  res.render("user/index", {
    title: "KaaBee",
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
    res.render("user/show", {
      user: user
    });
  } else {
    res.status(404);
    res.send("Not found");
  }
}

/**
 * POST /users/:userId/
 * Update a user.
 */
export async function update(req: Request, res: Response): Promise<void> {
  const user = await User.findOne(req.params["userId"]);
  if (user !== undefined) {
    user.email = req.body.email;
    user.name = req.body.name;
    user.admin = req.body.admin == "on";
    const { updated, errors } = await user.saveIfValid();
    res.render("user/show", {
      user: updated || user,
      errors
    });
  } else {
    res.status(404);
    res.send("Not found");
  }
}
