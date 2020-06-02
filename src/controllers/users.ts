import { Request, Response } from "express";
import { User } from "../models/user";
import { withAuthorized } from "../helpers/permission";

/**
 * GET /users/
 * A list of all users.
 */
export async function index(req: Request, res: Response): Promise<void> {
  await withAuthorized(req, res,
    async () => User.find(),
    async currentUser => currentUser?.admin,
    async users => res.render("user/index", {
      title: "KaaBee",
      users,
    })
  );
}

/**
 * GET /users/:userId/
 * Show a single user.
 */
export async function show(req: Request, res: Response): Promise<void> {
  await withAuthorized(req, res,
    async () => await User.findOne(req.params["userId"]),
    async currentUser => currentUser?.admin,
    async user => res.render("user/show", {
      user
    }));
}


/**
 * POST /users/:userId/
 * Update a user.
 */
export async function update(req: Request, res: Response): Promise<void> {
  await withAuthorized<User, void>(req, res,
    () => User.findOne(req.params["userId"]),
    async currentUser => currentUser?.admin,
    async user => {
      user.email = req.body.email;
      user.name = req.body.name;
      user.admin = req.body.admin == "on";
      const { updated, errors } = await user.saveIfValid();
      res.render("user/show", {
        user: updated || user,
        errors
      });
    }
  );
}
