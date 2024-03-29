from sympy import Line


def line_intersection(line1, line2):
    """
    Find 2 lines intersection point
    """
    l1 = Line(line1[0], line1[1])
    l2 = Line(line2[0], line2[1])

    intersection = l1.intersection(l2)
    return intersection[0].coordinates
