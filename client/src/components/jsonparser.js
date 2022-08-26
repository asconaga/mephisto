import React, { Component, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const JSONParser = ({ json }) => {

    const itemsRef = useRef([]);

    class TestReader {
        m_definitions = null;
        m_indexRef = null;
        m_nKey = 0;

        SetRef = (ref) => {
            this.m_indexRef = ref;
        };

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

                    let objData = { type: objType, title: key };
                    retVal.push(this.generateLine(objData, this.m_nKey++));

                    if (bIsObj) {
                        let ret = <div key={this.generateKey()} style={{ position: 'absolute', opacity: 0, height: '0' }} className='json-block' > {
                            this.navigateHTML(jsonObj[key], nDepth + 1)
                        } </div >;
                        retVal.push(ret);
                    }
                }
                else {
                    let objData = { title: key, type: objType, value: newObj };
                    retVal.push(this.generateLine(objData));
                }
            }

            return retVal;
        };

        generateHTML = (json) => {
            let ret = this.navigateHTML(json, 0);

            return ret;
        };

        dropMenu = (evt, index) => {
            const pop = this.m_indexRef.current[index].parentElement;

            let currentText = this.m_indexRef.current[index].innerText;

            // YAKUBU try             transform: scaleY(0);                    transform: scaleY(1);

            let height = 'auto';
            let position = 'relative';
            let opacity = '1';
            if (currentText === '▼ ') {
                currentText = '► ';
                height = '0';
                opacity = 0;
                position = 'absolute';
            }
            else {
                currentText = '▼ ';
            }

            this.m_indexRef.current[index].innerText = currentText;
            pop.nextElementSibling.style.height = height;
            pop.nextElementSibling.style.position = position;
            pop.nextElementSibling.style.opacity = opacity;
        };

        generateKey = () => {
            return (Math.random() + Date.now());
        };

        generateLine = (user, index) => {
            let divObj = '';

            // for array and object

            let divAdditional = '';

            if (user.value === undefined) {
                divAdditional = <span ref={el => this.m_indexRef.current[index] = el}
                    className='json-drop'
                    onClick={(e) => this.dropMenu(e, index)}>{'► '}</span>;

                divObj = <span className="json-type">({user.type})</span>;
            }
            else {
                divAdditional = '';
            }

            let divMain =
                <div key={this.generateKey()} className="json-line">
                    {divAdditional}
                    <span className="json-title">{user.title}:</span> {this.generateValue(user)} {divObj}
                </div>;

            return divMain;
        };
    }

    const newTester = new TestReader();
    newTester.SetRef(itemsRef);

    useEffect(() => {
    }, []);

    return (
        <div className='json-parser'>
            {newTester.generateHTML(json)}
        </div>
    );
};

JSONParser.propTypes = {
    json: PropTypes.any.isRequired,
};

export default JSONParser;