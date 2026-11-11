"""Compatibility alias: settings live in app.settings."""

from app.settings import Settings, get_settings

__all__ = ["Settings", "get_settings"]
