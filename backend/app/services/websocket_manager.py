from typing import List, Dict, Any
from fastapi import WebSocket
import json
import logging
import asyncio

logger = logging.getLogger(__name__)

class WebSocketManager:
    """WebSocket connection manager for real-time communication"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_data: Dict[WebSocket, Dict[str, Any]] = {}
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_data[websocket] = {
            "connected_at": asyncio.get_event_loop().time(),
            "predictions_count": 0
        }
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            if websocket in self.connection_data:
                del self.connection_data[websocket]
            logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket):
        """Send a message to a specific WebSocket connection"""
        try:
            await websocket.send_text(json.dumps(message))
            
            # Update connection stats
            if websocket in self.connection_data:
                if message.get("type") == "prediction":
                    self.connection_data[websocket]["predictions_count"] += 1
                    
        except Exception as e:
            logger.error(f"Error sending WebSocket message: {e}")
            self.disconnect(websocket)
    
    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast a message to all connected WebSocket clients"""
        if not self.active_connections:
            return
        
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to WebSocket: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected:
            self.disconnect(connection)
    
    async def send_system_status(self, status: Dict[str, Any]):
        """Send system status update to all connections"""
        message = {
            "type": "system_status",
            "data": status,
            "timestamp": asyncio.get_event_loop().time()
        }
        await self.broadcast(message)
    
    async def send_model_update(self, model_info: Dict[str, Any]):
        """Send model update notification to all connections"""
        message = {
            "type": "model_update",
            "data": model_info,
            "timestamp": asyncio.get_event_loop().time()
        }
        await self.broadcast(message)
    
    def get_connection_stats(self) -> Dict[str, Any]:
        """Get statistics about active connections"""
        total_predictions = sum(
            data.get("predictions_count", 0) 
            for data in self.connection_data.values()
        )
        
        return {
            "active_connections": len(self.active_connections),
            "total_predictions": total_predictions,
            "connections_data": [
                {
                    "connected_at": data["connected_at"],
                    "predictions_count": data["predictions_count"]
                }
                for data in self.connection_data.values()
            ]
        }