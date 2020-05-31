import { User } from "../models/user";
import { Request, Response } from "express";

export async function respondWith404(req: Request, res: Response): Promise<void> {
  res.status(404);
  res.render("error/404");
}

export async function redirectToLogin(req: Request, res: Response): Promise<void> {
  res.redirect("/login");
}

/**
 * This function aggregates a lot of the non-happy results (not found, unauthorized),
 * in order to focus on the happy flow of the current action.
 *
 * @param req the current Request object
 * @param res the current Response object
 * @param queryData  an async function which fetches the needed data for this action from the database.
 *                   If this returns undefined, we call responseNotFound.
 * @param authorize  an async function which tells whether the current user is authorized or not.
 *                   If this returns false, we call responseForbidden if the user is authenticated and
 *                   responseUnauthenticated if the user is not yet logged in.
 * @param action the main action which is performed
 * @param responseNotFound what to respond if the query returns nothing
 * @param responseForbidden what to respond if the user is not authorized to perform the action
 * @param responseUnauthorized what to respond if the user is not logged in
 */
export async function withAuthorized<Data, Result>(
  req: Request, res: Response,
  queryData: () => Promise<Data | undefined>,
  authorize: (currentUser: User | undefined, data: Data) => Promise<boolean | undefined>,
  action: (data: Data) => Promise<Result> | Result,
  responseNotFound: (req: Request, res: Response) => Promise<void> = respondWith404,
  responseForbidden: (req: Request, res: Response) => Promise<void> = respondWith404,
  responseUnauthorized: (req: Request, res: Response) => Promise<void> = redirectToLogin,

): Promise<Result | void> {
  const data = await queryData();
  if(data == null) {
    return await responseNotFound(req, res);
  } else if (!await authorize(res.locals.currentUser, data)) {
    if (res.locals.currentUser) {
      return await responseForbidden(req, res);
    } else {
      return await responseUnauthorized(req, res);
    }
  } else {
    return action(data);
  }
}