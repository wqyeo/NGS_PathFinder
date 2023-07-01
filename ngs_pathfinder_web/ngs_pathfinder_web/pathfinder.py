import random
import heapq

from .node import Node

def _calculate_distance(node1, node2):
    lat_diff = node1._lat - node2._lat
    lng_diff = node1._lng - node2._lng
    distance = (lat_diff ** 2 + lng_diff ** 2) ** 0.5
    return distance

def find_shortest_path(nodes: list[Node]) -> list[Node]:
    start_node = random.choice(nodes)
    end_node = random.choice(nodes)
    while start_node == end_node:
        end_node = random.choice(nodes)

    # Priority queue for the open list
    open_list = [(0, start_node)]  # (cost, node)
    heapq.heapify(open_list)

    # Store the cost to reach each node
    cost_so_far = {start_node: 0}

    # Store the previous node in the shortest path
    came_from = {}

    while open_list:
        _, current_node = heapq.heappop(open_list)

        if current_node == end_node:
            # Reached the end node, construct path
            path = []
            while current_node in came_from:
                path.append(current_node)
                current_node = came_from[current_node]
            path.append(start_node)
            path.reverse()
            return path

        for neighbor_node in nodes:
            if neighbor_node == current_node:
                continue

            # Calculate cost to reach the neighbor node from the current node
            neighbor_cost = _calculate_distance(current_node, neighbor_node)

            # Calculate total cost from start to neighbor through the current node
            total_cost = cost_so_far[current_node] + neighbor_cost

            if neighbor_node not in cost_so_far or total_cost < cost_so_far[neighbor_node]:
                # Update cost and previous node for the neighbor node
                cost_so_far[neighbor_node] = total_cost
                came_from[neighbor_node] = current_node
                heapq.heappush(open_list, (total_cost, neighbor_node))
    return None