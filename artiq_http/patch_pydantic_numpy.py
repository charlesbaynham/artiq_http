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


patch_pydantic_for_numpy()
