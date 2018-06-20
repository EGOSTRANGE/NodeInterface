const state = {
  nodeId: 0,
  inputId: 0,
  outputId: 0,
  formId: 0,
  nodes: [],
  inputs: [],
  outputs: [],
  forms: [],
  connections: []
};

//getters receive state
const getters = {
  nodes({nodes}) {
    return nodes;
  },
  nodeById({nodes}, id) {
    return nodes.find(elem => id === elem.id);
  },
  inputById({inputs}, id) {
    return inputs.find(input => id === input.id);
  },
  outputById({outputs}, id) {
    return outputs.find(output => id === output.id);
  }
};

//mutations receive state
const mutations = {
  getNodeId(state) {
    let newId = state.nodeId;
    state.nodeId++;
    return newId;
  },
  getInputId(state) {
    let newId = state.inputId;
    state.inputId++;
    return newId;
  },
  getOutputId(state) {
    let newId = state.outputId;
    state.outputId++;
    return newId;
  },
  getFormId(state) {
    let newId = state.formId;
    state.formId++;
    return newId;
  },
  createInput(state, blueprint) {
    let newInput = {
      id: mutations.getInputId(state),
      label: blueprint.label,
      connected: false,
      connectedOutput: null,
      node: null,
    };
    state.inputs.push(newInput);
    return newInput;
  },
  deleteInput(state, input) {
    mutations.disconnect(state, input);
    state.inputs.find((i, index) => {
      if (input === i) {
        state.inputs.splice(index, 1);
        return true;
      }
    });
  },
  createOutput(state, blueprint) {
    let newOutput = {
      id: mutations.getOutputId(state),
      label: blueprint.label,
      connectedInputs: [],
      node: null,
    };
    state.outputs.push(newOutput);
    return newOutput;
  },
  deleteOutput(state, output) {
    output.connectedInputs.map(input => {
      mutations.disconnect(state, input);
    });
    state.outputs.find((o, index) => {
      if (output === o) {
        state.outputs.splice(index, 1);
        return true;
      }
    });
  },
  createForm(state, blueprint) {
    let newForm = {
      id: mutations.getFormId(state),
      label: blueprint.label,
      type: blueprint.type,
      data: null,
      node: null,
      updated: false
    };
    state.forms.push(newForm);
    return newForm;
  },
  deleteForm(state, form) {
    state.forms.find((f, index) => {
      if (form === f) {
        state.forms.splice(index, 1);
        return true;
      }
    });
  },
  createNode(state, blueprint) {
    let newNode = {};
    let inputs = [];
    blueprint.inputs.map(inputBlueprint => {
      let input = mutations.createInput(state, inputBlueprint);
      input.node = newNode;
      inputs.push(input);
    });
    let outputs = [];
    blueprint.outputs.map(outputBlueprint => {
      let output = mutations.createOutput(state, outputBlueprint);
      output.node = newNode;
      outputs.push(output);
    });
    let form = mutations.createForm(state, blueprint.form);
    form.node = newNode;
    newNode.label = blueprint.label;
    newNode.inputs = inputs;
    newNode.outputs = outputs;
    newNode.form = form;
    newNode.id = mutations.getNodeId(state);
    state.nodes.push(newNode);
  },
  deleteNode(state, node) {
    console.log(node);
    node.inputs.map(input => {
      mutations.deleteInput(state, input);
    });
    node.outputs.map(output => {
      mutations.deleteOutput(state, output);
    });
    mutations.deleteForm(state, node.form);
    state.nodes.splice(state.nodes.indexOf(node), 1);
    console.log(state);
  },
  connect(state, {input, output}) {
    input.connectedOutput = output;
    input.connected = true;
    output.connectedInputs.push(input);
    state.connections.push({input: input, output: output});
  },
  disconnect(state, input) {
    if (input.connected) {
      let output = input.connectedOutput;
      input.connected = false;
      input.connectedOutput = null;
      state.connections.splice(state.connections.indexOf(input), 1);
      output.connectedInputs.splice(output.connectedInputs.indexOf(input), 1);
    }
  },

  //FORMS

};

//actions receive context
const actions = {
  createNode({commit}, blueprint) {
    commit('createNode', blueprint);
  },
  deleteNode({commit}, node) {
    commit('deleteNode', node);
  },
  connect({commit}, event) {
    commit('connect', event);
  },
  disconnect({commit}, input) {
    commit('disconnect', input);
  },
};

export default {
  state,
  getters,
  mutations,
  actions
}
