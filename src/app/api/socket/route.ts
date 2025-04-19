import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { initSocketServer, NextApiResponseWithSocket } from "@/lib/socket";

export async function GET(req: NextApiRequest) {
  // Socket.io will handle the connection upgrade
  return new NextResponse("Socket API - This endpoint is used by Socket.io for WebSocket connections");
}

export async function POST(req: NextApiRequest, res: NextApiResponseWithSocket) {
  // Initialize Socket.io server
  initSocketServer(req, res);

  return NextResponse.json({ message: "Socket server initialized" });
}
