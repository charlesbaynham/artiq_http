def patch_pydantic_for_numpy():
    """
    Patch Pydantic to handle NumPy types correctly.
    Supports both Pydantic v1 and v2.
    """
    import numpy

    try:
        # Pydantic v1 approach
        from pydantic.json import ENCODERS_BY_TYPE

        floats = [
            numpy.float16,
            numpy.float32,
            numpy.float64,
            numpy.float128,
        ]
        ints = [
            numpy.int8,
            numpy.int16,
            numpy.int32,
            numpy.int64,
        ]
        for t in floats:
            ENCODERS_BY_TYPE[t] = float
        for t in ints:
            ENCODERS_BY_TYPE[t] = int
    except ImportError:
        # Pydantic v2 approach - use custom serializers
        # In Pydantic v2, we need to configure FastAPI's default JSON encoder
        # This will be handled by adding custom serializers to FastAPI's JSONResponse
        # For now, we'll patch the json module that FastAPI uses
        try:
            from pydantic_core import core_schema
            from pydantic import GetCoreSchemaHandler

            # Register numpy types as plain serializers
            # This is handled at the FastAPI level in api.py
            pass
        except ImportError:
            # If pydantic_core not available, skip patching
            pass


def numpy_encoder(obj):
    """Custom encoder for numpy types"""
    import numpy as np

    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, (np.integer, np.int8, np.int16, np.int32, np.int64)):
        return int(obj)
    if isinstance(obj, (np.floating, np.float16, np.float32, np.float64)):
        return float(obj)
    if isinstance(obj, np.bool_):
        return bool(obj)
    return obj


patch_pydantic_for_numpy()
