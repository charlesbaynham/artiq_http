def patch_pydantic_for_numpy():
    from pydantic.json import ENCODERS_BY_TYPE
    import numpy

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


patch_pydantic_for_numpy()
