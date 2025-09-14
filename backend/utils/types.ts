interface JwtPayload {
  userId: string;
  role: "customer" | "admin";
}

export { JwtPayload };
