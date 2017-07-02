const CircParser = require("./gen/CircParser").CircParser;
const CircParserVisitor = require("./gen/CircParserVisitor").CircParserVisitor;

const NodeType = {
  unsupported: "unsupported",
  nullLiteral: "nullLiteral",
  booleanLiteral: "booleanLiteral",
  stringLiteral: "stringLiteral",
  numberLiteral: "numberLiteral",
  arrayLiteral: "arrayLiteral",
  memberIndex: "memberIndex",
  objectLiteral: "objectLiteral",
  objectProperty: "objectProperty",
  thisExpr: "this",
  memberDot: "memberDot",
  varDeclaration: "varDeclaration",
  varDeclarationList: "varDeclarationList",
  identifier: "identifier",
  funDeclaration: "funDeclaration",
  funCall: "funCall",
  binary: "binary",
  condition: "condition",
  exprSequence: "exprSequence",
  assign: "assign",
  block: "block",
  prog: "prog",
};
exports.NodeType = NodeType;

class Node {
  constructor (type = NodeType.unsupported) {
    this.type = type;
  }

  toJson () {
    return {
      type: this.type
    };
  }
}

class LiteralNode extends Node {
  constructor (type, value = null) {
    super(type);
    this.value = value;
  }

  toJson () {
    const json = super.toJson();
    json.value = this.value;
    return json;
  }
}

class NullLiteralNode extends LiteralNode {
  constructor () {
    super(NodeType.nullLiteral, null);
  }
}

class BooleanLiteralNode extends LiteralNode {
  constructor (value) {
    super(NodeType.booleanLiteral, value);
  }
}

class StringLiteralNode extends LiteralNode {
  constructor (value) {
    super(NodeType.stringLiteral, eval(value));
  }
}

class NumberLiteralNode extends LiteralNode {
  constructor (value) {
    super(NodeType.numberLiteral, value);
  }
}

class VarDeclarationNode extends Node {
  constructor (identifier, statement) {
    super(NodeType.varDeclaration);
    this.left = identifier;
    this.right = statement;
  }

  toJson () {
    const json = super.toJson();
    json.left = this.left.toJson();
    json.right = this.right.toJson();
    return json;
  }
}

class VarDeclarationListNode extends Node {
  constructor () {
    super(NodeType.varDeclarationList);
    this.exprList = [];
  }

  toJson () {
    const json = super.toJson();
    json.exprList = this.exprList.map(exp => exp.toJson());
    return json;
  }
}

class IdentifierNode extends Node {
  constructor (name) {
    super(NodeType.identifier);
    this.name = name;
  }

  toJson () {
    const json = super.toJson();
    json.name = this.name;
    return json;
  }
}

class FunDeclarationNode extends Node {
  constructor () {
    super(NodeType.funDeclaration);
    this.name = null;
    this.formalParamList = [];
    this.body = null;
  }

  toJson () {
    const json = super.toJson();
    json.name = this.name;
    json.formalParamList = this.formalParamList.map(p => p.toJson());
    json.body = this.body.toJson();
    return json;
  }
}

class FunCallExprNode extends Node {
  constructor () {
    super(NodeType.funCall);
    this.prodFunExpr = null;
    this.paramList = [];
  }

  toJson () {
    const json = super.toJson();
    json.prodFunExpr = this.prodFunExpr.toJson();
    json.paramList = this.paramList.map(p => p.toJson());
    return json;
  }
}

class BinaryExprNode extends Node {
  constructor () {
    super(NodeType.binary);
    this.op = null;
    this.left = null;
    this.right = null;
  }

  toJson () {
    const json = super.toJson();
    json.op = this.op;
    json.left = this.left.toJson();
    json.right = this.right.toJson();
    return json;
  }
}

class ConditionExprNode extends Node {
  constructor () {
    super(NodeType.condition);
    this.expr = null;
    this.then = null;
    this.else = null;
  }

  toJson () {
    const json = super.toJson();
    json.expr = this.expr.toJson();
    json.then = this.then.toJson();
    json.else = this.else.toJson();
    return json;
  }
}

class ExprSequenceNode extends Node {
  constructor () {
    super(NodeType.exprSequence);
    this.exprList = [];
  }

  toJson () {
    if (this.exprList.length === 1) {
      return this.exprList[0].toJson();
    } else {
      const json = super.toJson();
      json.exprList = this.exprList.map(exp => exp.toJson());
      return json;
    }
  }
}

class AssignExprNode extends Node {
  constructor () {
    super(NodeType.assign);
    this.left = null;
    this.right = null;
  }

  toJson () {
    const json = super.toJson();
    json.left = this.left.toJson();
    json.right = this.right.toJson();
    return json;
  }
}

class BlockNode extends Node {
  constructor () {
    super(NodeType.block);
    this.exprList = [];
  }

  toJson () {
    const json = super.toJson();
    json.exprList = this.exprList.map(exp => exp.toJson());
    return json;
  }
}

class ProgNode extends BlockNode {
  constructor () {
    super();
    this.type = NodeType.prog;
  }
}

class ArrayLiteralNode extends Node {
  constructor () {
    super(NodeType.arrayLiteral);
    this.items = [];
  }

  toJson () {
    const json = super.toJson();
    json.items = this.items.map(item => item.toJson());
    return json;
  }
}

class MemberIndexExprNode extends Node {
  constructor () {
    super(NodeType.memberIndex);
    this.left = null;
    this.right = null;
  }

  toJson () {
    const json = super.toJson();
    json.left = this.left.toJson();
    json.right = this.right.toJson();
    return json;
  }
}

class ObjectPropertyNode extends Node {
  constructor () {
    super(NodeType.objectProperty);
    this.left = null;
    this.right = null;
  }

  toJson () {
    const json = super.toJson();
    json.left = this.left.toJson();
    json.right = this.right.toJson();
    return json;
  }
}

class ObjectLiteralNode extends Node {
  constructor () {
    super(NodeType.objectLiteral);
    this.properties = [];
  }

  toJson () {
    const json = super.toJson();
    json.properties = this.properties.map(node => node.toJson());
    return json
  }
}

class MemberDotExprNode extends Node {
  constructor () {
    super(NodeType.memberDot);
    this.left = null;
    this.right = null;
  }

  toJson () {
    const json = super.toJson();
    json.left = this.left.toJson();
    json.right = this.right.toJson();
    return json;
  }
}

class ThisExprNode extends Node {
  constructor () {
    super(NodeType.thisExpr);
  }
}

class AstVisitor extends CircParserVisitor {
  visitFormalParameterList (ctx) {
    if (!ctx) {
      return [];
    }
    return ctx.Identifier().map(ctx => new IdentifierNode(ctx.getText()));
  }

  visitStatementList (ctx) {
    if (!ctx) {
      return [];
    }
    return ctx.statement().map(ctx => this.visitStatement(ctx)).filter(node => node !== null);
  }

  visitFunctionBody (ctx) {
    return this.visitStatementList(ctx.statementList());
  }

  visitFunExpr (ctx) {
    const node = new FunDeclarationNode();
    if (ctx.Identifier()) {
      node.name = new IdentifierNode(ctx.Identifier().getText());
    }
    node.formalParamList = this.visitFormalParameterList(ctx.formalParameterList());

    const body = new BlockNode();
    body.exprList = this.visitFunctionBody(ctx.functionBody());
    node.body = body;
    return node;
  }

  visitArgumentList (ctx) {
    if (!ctx) {
      return [];
    }
    return ctx.singleExpr().map(ctx => this.visitSingleExpr(ctx));
  }

  visitArguments (ctx) {
    return this.visitArgumentList(ctx.argumentList());
  }

  visitElementList (ctx) {
    return ctx.singleExpr().map(ctx => this.visitSingleExpr(ctx));
  }

  visitArrayLiteral (ctx) {
    const node = new ArrayLiteralNode();
    node.items = this.visitElementList(ctx.elementList());
    return node;
  }

  visitStaticPropertyName (ctx) {
    const node = new ObjectPropertyNode();
    node.left = new StringLiteralNode(ctx.StringLiteral().getText());
    node.right = this.visitSingleExpr(ctx.singleExpr());
    return node;
  }

  visitExprPropertyName (ctx) {
    const node = new ObjectPropertyNode();
    node.left = this.visitSingleExpr(ctx.propertyNameExpr);
    node.right = this.visitSingleExpr(ctx.propertyValExpr);
    return node;
  }

  visitPropertyAssignment (ctx) {
    if (ctx instanceof CircParser.StaticPropertyNameContext) {
      return this.visitStaticPropertyName(ctx);
    } else if (ctx instanceof CircParser.ExprPropertyNameContext) {
      return this.visitExprPropertyName(ctx);
    }
  }

  visitPropertyNameAndValueList (ctx) {
    return ctx.propertyAssignment().map(ctx => this.visitPropertyAssignment(ctx));
  }

  visitObjectLiteral (ctx) {
    const node = new ObjectLiteralNode();
    node.properties = this.visitPropertyNameAndValueList(ctx.propertyNameAndValueList());
    return node;
  }

  visitSingleExpr (ctx) {
    if (ctx instanceof CircParser.LiteralExprContext) {
      const literal = ctx.literal();
      if (literal.numericLiteral()) {
        return new NumberLiteralNode(Number(literal.getText()));
      } else if (literal.NullLiteral()) {
        return new NullLiteralNode();
      } else if (literal.BooleanLiteral()) {
        return new BooleanLiteralNode(literal.getText() === "true");
      } else if (literal.StringLiteral()) {
        return new StringLiteralNode(literal.getText());
      }
    } else if (ctx instanceof CircParser.FunExprContext) {
      return this.visitFunExpr(ctx);
    } else if (ctx instanceof CircParser.AddExprContext
      || ctx instanceof CircParser.MultiplyExprContext
      || ctx instanceof CircParser.RelationalExprContext
      || ctx instanceof CircParser.EqualityExprContext) {
      const node = new BinaryExprNode();
      node.left = this.visitSingleExpr(ctx.singleExpr(0));
      node.right = this.visitSingleExpr(ctx.singleExpr(1));
      if (ctx.Plus && ctx.Plus()) {
        node.op = '+';
      } else if (ctx.Minus && ctx.Minus()) {
        node.op = '-';
      } else if (ctx.Multiply && ctx.Multiply()) {
        node.op = '*';
      } else if (ctx.Divide && ctx.Divide()) {
        node.op = '/';
      } else if (ctx.Modulus && ctx.Modulus()) {
        node.op = '%';
      } else if (ctx.LessThan && ctx.LessThan()) {
        node.op = '<';
      } else if (ctx.MoreThan && ctx.MoreThan()) {
        node.op = '>';
      } else if (ctx.LessThanEquals && ctx.LessThanEquals()) {
        node.op = '<=';
      } else if (ctx.GreaterThanEquals && ctx.GreaterThanEquals()) {
        node.op = '>=';
      } else if (ctx.Equals && ctx.Equals()) {
        node.op = '==';
      } else if (ctx.NotEquals && ctx.NotEquals()) {
        node.op = '!=';
      }
      return node;
    } else if (ctx instanceof CircParser.ParenExprContext) {
      return this.visitExprSequence(ctx.exprSequence())
    } else if (ctx instanceof CircParser.FunCallExprContext) {
      const node = new FunCallExprNode();
      node.paramList = this.visitArguments(ctx.arguments());
      node.prodFunExpr = this.visitSingleExpr(ctx.singleExpr());
      return node;
    } else if (ctx instanceof CircParser.IdentifierExprContext) {
      return new IdentifierNode(ctx.Identifier().getText());
    } else if (ctx instanceof CircParser.LambdaExprContext) {
      const node = new FunDeclarationNode();
      if (ctx.Identifier()) {
        node.formalParamList = [
          new IdentifierNode(ctx.Identifier().getText())
        ];
      } else {
        node.formalParamList = this.visitArguments(ctx.arguments());
      }
      node.body = this.visitNoEmptyStatement(ctx.noEmptyStatement());
      return node;
    } else if (ctx instanceof CircParser.AssignExprContext) {
      const node = new AssignExprNode();
      node.left = this.visitSingleExpr(ctx.singleExpr());
      node.right = this.visitNoEmptyStatement(ctx.noEmptyStatement());
      return node;
    } else if (ctx instanceof CircParser.ArrayLiteralExprContext) {
      return this.visitArrayLiteral(ctx.arrayLiteral());
    } else if (ctx instanceof CircParser.MemberIndexExprContext) {
      const node = new MemberIndexExprNode();
      node.left = this.visitSingleExpr(ctx.singleExpr());
      node.right = this.visitExprSequence(ctx.exprSequence());
      return node;
    } else if (ctx instanceof CircParser.ObjectLiteralExprContext) {
      return this.visitObjectLiteral(ctx.objectLiteral());
    } else if (ctx instanceof CircParser.ThisExprContext) {
      return new ThisExprNode();
    } else if (ctx instanceof CircParser.MemberDotExprContext) {
      const node = new MemberDotExprNode();
      node.left = this.visitSingleExpr(ctx.singleExpr());
      node.right = new IdentifierNode(ctx.Identifier().getText());
      return node;
    }
  }

  visitExprSequence (ctx) {
    const node = new ExprSequenceNode();
    node.exprList = ctx.singleExpr().map(ctx => this.visitSingleExpr(ctx));
    return node;
  }

  visitInitializer (ctx) {
    return this.visitNoEmptyStatement(ctx.noEmptyStatement());
  }

  visitVariableDeclaration (ctx) {
    const node = new VarDeclarationNode();
    node.left = new IdentifierNode(ctx.Identifier().getText());
    node.right = this.visitInitializer(ctx.initializer());
    return node;
  }

  visitVarDeclarationList (ctx) {
    const node = new VarDeclarationListNode();
    node.exprList = ctx.variableDeclaration().map(ctx => this.visitVariableDeclaration(ctx));
    return node;
  }

  visitVarDeclarationStatement (ctx) {
    return this.visitVarDeclarationList(ctx.varDeclarationList());
  }

  visitIfStatementBody (ctx) {
    return this.visitStatement(ctx.statement());
  }

  visitIfStatement (ctx) {
    const node = new ConditionExprNode();
    node.expr = this.visitSingleExpr(ctx.singleExpr());
    node.then = this.visitIfStatementBody(ctx.thenBody);
    node.else = this.visitIfStatementBody(ctx.elseBody);
    return node;
  }

  visitBlockStatement (ctx) {
    return this.visitStatementList(ctx.statementList());
  }

  visitNoEmptyStatement (ctx) {
    return this.visitStatement(ctx);
  }

  visitStatement (ctx) {
    if (ctx.exprStatement()) {
      return this.visitExprSequence(ctx.exprStatement().exprSequence());
    } else if (ctx.varDeclarationStatement()) {
      return this.visitVarDeclarationStatement(ctx.varDeclarationStatement());
    } else if (ctx.ifStatement()) {
      return this.visitIfStatement(ctx.ifStatement());
    } else if (ctx.blockStatement()) {
      const node = new BlockNode();
      node.exprList = this.visitBlockStatement(ctx.blockStatement());
      return node;
    } else if (ctx.emptyStatement()) {
      return null;
    }
  }

  visitStatements (ctx) {
    if (!ctx) {
      return [];
    }
    return ctx.statement().map(ctx => this.visitStatement(ctx)).filter(node => node !== null);
  }

  visitProgram (ctx) {
    const node = new ProgNode();
    node.exprList = this.visitStatements(ctx.statements());
    return node;
  }
}

exports.ast = (parser) => {
  return new AstVisitor().visitProgram(parser.program()).toJson();
};
