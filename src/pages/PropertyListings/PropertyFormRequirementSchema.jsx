import React from 'react'
import structure from "./PropertyStructure.json";

// Recursively extract required keys from a config object
function extractRequiredKeys(obj, keys = []) {
  if (Array.isArray(obj)) {
    obj.forEach(item => extractRequiredKeys(item, keys));
  } else if (typeof obj === "object" && obj !== null) {
    if (
      obj.key &&
      obj.key !== "" &&
      obj.prop !== "disabled_label" &&
      obj.props !== "disabled_label"
    ) {
      keys.push(obj.key);
    }
    Object.values(obj).forEach(val => extractRequiredKeys(val, keys));
  }
  return keys;
}

// Build schema for all listing types and property types
export function buildRequirementSchema(structure) {
  const schema = {};
  const tabs = structure.propertyStructure.tabs;
  tabs.forEach(tab => {
    const tabName = tab.name;
    schema[tabName] = {};
    const propertyTypes = tab.PropertyType[0];
    Object.entries(propertyTypes).forEach(([category, properties]) => {
      properties.forEach(property => {
        const propTypeKey = property.key;
        const inputs = property.inputs?.[0] || {};
        schema[tabName][propTypeKey] = extractRequiredKeys(inputs, []);
      });
    });
  });
  return schema;
}

const PropertyFormRequirementSchema = () => {
  const requirementSchema = buildRequirementSchema(structure);

  return (
    <div>
      <h2>Property Form Requirement Schema</h2>
      <pre style={{ fontSize: 12, background: "#f8f8f8", padding: 12 }}>
        {JSON.stringify(requirementSchema, null, 2)}
      </pre>
    </div>
  );
};

export default PropertyFormRequirementSchema;