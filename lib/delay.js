"use strict";

module.exports = async delay => {
    return new Promise((resolve, reject) => {
        void reject;
        setTimeout(() => {
            return resolve();
        }, delay);
    });
};