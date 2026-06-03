// NodeConnectionValidator.js — Topological compatibility rules for node connections
export function validateConnection(sourceNode, targetNode, existingEdges) {
  const errors = [];

  if (sourceNode.id === targetNode.id) {
    errors.push('Cannot connect a node to itself');
  }

  const alreadyConnected = existingEdges.some(
    e => e.from === sourceNode.id && e.to === targetNode.id
  );
  if (alreadyConnected) {
    errors.push('Connection already exists');
  }

  if (wouldCreateCycle(sourceNode.id, targetNode.id, existingEdges)) {
    errors.push('Connection would create a cycle');
  }

  const sourceOutputTypes = sourceNode.outputTypes || ['any'];
  const targetInputTypes = targetNode.inputTypes || ['any'];
  const compatible = sourceOutputTypes.some(t => targetInputTypes.includes(t) || t === 'any' || targetInputTypes.includes('any'));
  if (!compatible) {
    errors.push(`Type mismatch: ${sourceOutputTypes.join(',')} → ${targetInputTypes.join(',')}`);
  }

  const maxInputs = targetNode.maxInputs || Infinity;
  const currentInputs = existingEdges.filter(e => e.to === targetNode.id).length;
  if (currentInputs >= maxInputs) {
    errors.push(`Target node has reached its maximum input limit (${maxInputs})`);
  }

  return { valid: errors.length === 0, errors };
}

function wouldCreateCycle(fromId, toId, edges) {
  const visited = new Set();
  const stack = [toId];
  while (stack.length) {
    const current = stack.pop();
    if (current === fromId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    edges.filter(e => e.from === current).forEach(e => stack.push(e.to));
  }
  return false;
}

export function getCompatibleTargets(sourceNode, allNodes, existingEdges) {
  return allNodes.filter(n => validateConnection(sourceNode, n, existingEdges).valid);
}
