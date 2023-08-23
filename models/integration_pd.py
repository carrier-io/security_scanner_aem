from typing import Optional
from pydantic import BaseModel
from pylon.core.tools import log


class IntegrationModel(BaseModel):

    scanner_host: Optional[str] = '127.0.0.1'
    scanner_port: Optional[str] = "4444"
    # save_intermediates_to: Optional[str] = '/data/intermediates/dast'

    def check_connection(self) -> bool:
        try:
            return True
        except Exception as e:
            log.exception(e)
            return False
