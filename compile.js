import code from  "./code.js";


function lexer(input) {
    const tokens = [];
    let cursor = 0;

    while (cursor < input.length) {
        let char = input[cursor];

        // Skip white space
        if (/\s/.test(char)) {
            cursor++;
            continue;
        }

        if (/[a-zA-Z]/.test(char)) {
            let word = '';
            while (/[a-zA-Z0-9]/.test(char)) {
                word += char;
                char = input[++cursor];
            }

            if (word === 'vara' || word === 'bare') {
                tokens.push({ type: 'keyword', value: word });
            } else {
                tokens.push({ type: 'variable', value: word });
            }
            continue;
        }

        if (/[0-9]/.test(char)) {
            let num = '';
            while (/[0-9]/.test(char)) {
                num += char;
                char = input[++cursor];
            }
            tokens.push({ type: 'number', value: parseInt(num) });
            continue;
        }

        if (/[\+\-\*\/=]/.test(char)) {
            tokens.push({ type: 'operator', value: char });
            cursor++;
            continue;
        }
    }
    return tokens;
}

function parser(tokens) {
    const ast = {
        type: 'program',
        body: []
    };

    while(tokens.length > 0) {
        const token = tokens.shift();

        if(token.type === 'keyword' && token.value === 'vara') {
            let declaration = {
                type: 'declaration',
                name: tokens.shift().value,
                value: null,
            }

            if(tokens[0].type === 'operator' &&  tokens[0].value === '=') {
                tokens.shift(); 

                let expression = '';
                while(tokens.length > 0 && tokens[0].type !== 'keyword') {
                    expression += tokens.shift().value;
                }

                declaration.value = expression.trim();
            }
            ast.body.push(declaration);
        }
        if (token.type === 'keyword' && token.value === 'bare') {
            ast.body.push({
                type: 'print',
                expression: tokens.shift().value
            });
        }
    }
    return ast;
}

function codeGen(node) {
    switch (node.type) {
        case 'program': return node.body.map(codeGen).join('\n');     
        case 'declaration': return `const ${node.name} = ${node.value};`     
        case 'print': return `console.log(${node.expression})`
        }

}

function compiler(input) {
    const tokens = lexer(input);
    console.log(tokens);
    const ast = parser(tokens);
    console.log(ast);
    const executableCode = codeGen(ast)
    console.log(executableCode);
    return executableCode
}

function runner(input) {
    const script = new Function(input);
    script();
}

const exec = compiler(code)
runner(exec)