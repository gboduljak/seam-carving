# Seam Carving

### Table of Contents

1. [Introduction](#introduction)
2. [Some interesting results](#some-interesting-results)
3. [A demo web app](#a-demo-web-app)
4. [Project setup](#project-setup)

## Introduction

Seam carving, known also as liquid rescaling, is an algorithm for 'content-aware' image resizing. The algorithm is developed by S.Avidan and A.Shamir. The main idea is to resize an image (thus reduce the image size) by removing the _least noticeable_ pixels and thus preserving the context. The idea is implemented by defining a suitable _energy_ metric for each pixel and then find a consecutive horizontal (or vertical) path of the _least energy_. That path is named as seam and that seam will be removed in the process of resizing.

The motivation and intuition behind is well [explained in this video](https://www.youtube.com/watch?time_continue=31&v=6NcIJXTlugc&feature=emb_logo).

The algorithm is surprisingly simple, but remarkably elegant:

1. Calculate the energy metric of each pixel.
   There are numerous methods covering this topic. The most popular approaches are **gradient magnitude**, **entropy**, **visual saliency map**, **eye-gaze movement**... I have chosen to approximate **gradient magnitude** by using a well known convolution **Sobel operator (3x3)**. This is a discrete differentiation operator usually used as a step in edge detection problem. [Learn more about Sobel here](https://en.wikipedia.org/wiki/sobel_operator)
2. Having computed the energy metric, find the lowest energy horizontal or vertical path - seam.
   This problem reduced to the shortest path problem solvable by many algorithms (Dijkstra's algorithm, Bellman-Ford...), but there is a beautiful and optimal dynamic programming solution I have decided to implement.
   It is interesting to note I have recently encountered [a surprisingly similar programming interview problem](https://leetcode.com/problems/minimum-path-sum/) solving exactly 'the lowest energy' problem.
3. Remove the lowest energy seam from the image

Although S.Avidan and A.Shamir present various interesting applications of the seam carving, including object removal, image enlarging and content amplification, I have chosen to implement only the simplest operation - image resizing. However, object removal can be reduced to the problem of image resizing and I will consider this feature in future.

## Implementation

### Energy computation

```python
sobel_kernels = {
    'x': array([
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ]),
    'y': array([
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1]
    ])
}

gaussian_kernel = (1/16) * array([
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
])

DIAGONAL = numpy.intp(1)
DOWN = numpy.intp(2)


def apply_sobel(image: array):
    blurred = convolve2d(image, gaussian_kernel, mode='same', boundary='symm')
    grad_x = convolve2d(
        blurred, sobel_kernels['x'], mode='same', boundary='symm')
    grad_y = convolve2d(
        blurred, sobel_kernels['y'], mode='same', boundary='symm')
    grad = sqrt(grad_x * grad_x + grad_y * grad_y)
    normalised_grad = grad * (255.0 / max(grad))
    return normalised_grad

```

### The optimal seam algorithm

We can solve the seam computation problem using dynamic programming by observing two important characteristics of the problem:

- Optimal substructure
  - Vertical seam case
    - We claim that the least energy seam from the first row of the picture to the last row must contain in itself the least energy seam from the corresponding position in the second row to the last row.
      - Proof: (By contradiction)
        - Assume there is a path of smaller energy from the corresponding position in the second row to the last row. Let that path be **v**.
  - Horizontal seam
    - The observation and proof is analagous.
- Overlapping subproblems

Since the problem satisfies above criteria, there is a natural recursive formula for the solution:

Now, observing that the topological ordering of problems is very simple, we can translate the above recursive formula directly into the bottom-up loop based implementation.

```python

@jit
def compute_optimal_seam(energy):
    rows, cols = energy.shape
    infinity = maxsize / 10
    dp = energy.copy()

    next_seam_position = zeros_like(dp, dtype=numpy.intp)

    for col in range(cols):
        dp[rows - 1][col] = energy[rows-1][col]

    for row in range(rows - 2, -1, -1):
        for col in range(cols):
            optimal_adjacent_cost = infinity
            optimal_choice = -1
            adjacents = [
                ((row + 1, col + 1), DIAGONAL),
                ((row + 1, col), DOWN)
            ]
            for (adjacent, choice) in adjacents:
                adjacent_row, adjacent_col = adjacent
                if not is_in_image(adjacent, rows, cols):
                    continue
                if dp[adjacent_row][adjacent_col] < optimal_adjacent_cost:
                    optimal_adjacent_cost = dp[adjacent_row][adjacent_col]
                    optimal_choice = choice

            next_seam_position[row][col] = optimal_choice
            dp[row][col] = energy[row][col] + optimal_adjacent_cost

    seam_start_col = argmin(dp[0, :])
    seam_start = (0, seam_start_col)
    seam_cost = dp[0][seam_start_col]
    return (seam_start, seam_cost, next_seam_position)

```

As a side note, I have decided to experiment with [Numba](http://numba.pydata.org/) library used to accelerate CPU intensive calculations by precompiling Python into a native code. I have receieved at least 30% speedup in compute*optimal_seam computation, but I had to sacrifice a bit on the side of code readability. Hence the algorithm implemented is possibly not the most \_pythonic*.

## Some interesting results

...

## A demo web app

...

## Project setup

...
