import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';

const JSONParser = ({ json }) => {

    class TestReader {
        m_definitions = null;
        m_lastDepth = -1;

        navigateSchemaTree = (jsonObj, rootObj) => {
            for (let key in jsonObj) {
                const newObj = jsonObj[key];

                let objType = typeof newObj;

                let bIsObj = false;

                if (objType === 'object') {

                    bIsObj = true;
                    if (Array.isArray(newObj)) {
                        objType = 'array';
                    }

                    const szCamelKey = key.charAt(0).toUpperCase() + key.slice(1);

                    let newDef = { type: objType, properties: {}, title: szCamelKey };
                    this.m_definitions[szCamelKey] = newDef;

                    if (rootObj != null) {
                        rootObj[szCamelKey] = { $ref: "#/definitions/" + szCamelKey };
                    }

                    if (bIsObj) {
                        this.navigateSchemaTree(jsonObj[key], newDef.properties);
                    }
                }
                else {
                    rootObj[key] = { type: objType, title: key };
                }
            }
        };

        // does not handle two elements of the same name with different properties
        generateSchema = (data) => {
            let rootObj = {
                $schema: "http://json-schema.org/draft-06/schema#",
                $ref: "#/definitions/Root",
                definitions: {}
            };

            this.m_definitions = rootObj["definitions"];

            const jsonObj = { Root: data };

            this.navigateSchemaTree(jsonObj, null);
            console.log(JSON.stringify(rootObj, null, '  '));
        };

        navigateTree = (jsonObj, nDepth) => {
            for (let key in jsonObj) {
                const newObj = jsonObj[key];

                let objType = typeof newObj;

                let bIsObj = false;

                if (objType === 'object') {

                    bIsObj = true;
                    if (Array.isArray(newObj)) {
                        objType = 'array';
                    }

                    let newDef = { type: objType, title: key, depth: nDepth };
                    this.m_definitions.push(newDef);

                    if (bIsObj) {
                        this.navigateTree(jsonObj[key], nDepth + 1);
                    }
                }
                else {
                    this.m_definitions.push({ title: key, type: objType, value: newObj, depth: nDepth });
                }
            }
        };

        generateTree = (data) => {
            this.m_definitions = [];

            this.navigateTree(data, 0);

            this.m_lastDepth = -1;
        };

        generateValue = (user) => {
            let value = "Undefined";
            let thisClass = 'json-' + user.type;

            value = user.value;
            switch (user.type) {
                case "boolean":
                    value = user.value ? 'true' : 'false';
                    break;
                case "string":
                    value = "\"" + value + "\"";
                    break;
                default:
                    break;
            }

            return <span className={thisClass}>{value}</span>;
        };

        generateOut = (user) => {

            let ret = <div>{user.title}</div>;

            return ret;

        };


        navigateHTML = (jsonObj, nDepth) => {
            let retVal = [];

            for (let key in jsonObj) {
                const newObj = jsonObj[key];

                let objType = typeof newObj;

                let bIsObj = false;

                if (objType === 'object') {

                    bIsObj = true;
                    if (Array.isArray(newObj)) {
                        objType = 'array';
                    }

                    let newDef = { type: objType, title: key, depth: nDepth };
                    retVal.push(<div>{key}-{objType}</div>);

                    if (bIsObj) {
                        let ret = <div className='json-block'> {
                            this.navigateHTML(jsonObj[key], nDepth + 1)
                        } </div>;
                        retVal.push(ret);
                    }
                }
                else {
                    ///this.m_definitions.push({ title: key, type: objType, value: newObj, depth: nDepth });
                    retVal.push(<div>{key}-{newObj}</div>);
                }
            }

            return retVal;
        };

        generateHTML = (json) => {
            let ret = <div className='json-block'> {
                this.navigateHTML(json, 0)
            } </div>;

            return ret;
        };

        generateLine = (user) => {
            console.log(this.m_lastDepth, user.depth);

            let divStyle = { paddingLeft: user.depth * 16 + "px" };
            let extra = "";

            this.m_lastDepth = user.depth;

            let divDrop = '';
            let divObj = '';

            if (user.value === undefined) {
                // divDrop = '▼-';

                divDrop = `${user.depth}-`;
                divObj = <span className="json-type">({user.type})</span>;
            }
            else {
                divDrop = '--';
            }
            //style={divStyle}

            let divMain =
                <div className="json-line">
                    <span className='json-drop'>{divDrop}</span>
                    <span className="json-title">{user.title}:</span> {this.generateValue(user)} {divObj}
                </div>;

            let divRet = <div>{divMain}</div>;

            return divRet;
        };
    }

    const newTester = new TestReader();
    newTester.generateTree(json);

    return (
        <div className='json-parser'>
            {newTester.generateHTML(json)}
        </div>
    );
};

JSONParser.propTypes = {
    json: PropTypes.object.isRequired,
};

export default JSONParser;