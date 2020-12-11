module.exports = (state, datasetIdsObj) => {
  var datasetIdStr = Object.entries(datasetIdsObj)
    .filter((datasetId) => datasetId[1])
    .map((datasetId) => datasetId[0])
    .toString();
  return `${
    state.referenceName !== "" ? `referenceName=${state.referenceName}&` : ""
  }${
    state.referenceBases !== "" ? `referenceBases=${state.referenceBases}&` : ""
  }${state.assemblyId !== "" ? `assemblyId=${state.assemblyId}&` : ""}${
    state.start !== "" ? `start=${state.start}&` : ""
  }${state.end !== "" ? `end=${state.end}&` : ""}${
    state.startMin !== "" ? `startMin=${state.startMin}&` : ""
  }${state.startMax !== "" ? `startMax=${state.startMax}&` : ""}${
    state.endMin !== "" ? `endMin=${state.endMin}&` : ""
  }${state.endMax !== "" ? `endMax=${state.endMax}&` : ""}${
    state.alternateBases !== "" ? `alternateBases=${state.alternateBases}&` : ""
  }${state.variantType !== "" ? `variantType=${state.variantType}&` : ""}${
    state.includeDatasetResponses !== ""
      ? `includeDatasetResponses=${state.includeDatasetResponses}&`
      : ""
  }${`datasetIds=${datasetIdStr}`}`;
};
