/*BSD 3-Clause License

Copyright (c) 2020, Blockception Ltd
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
import { Diagnostic, PublishDiagnosticsParams, Range } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { GetFilepath } from "../code/include";
import { Manager } from "../manager/Manager";
import { EmptyTypes } from "../minecraft/types/Empty";

export function InvalidJson(doc: TextDocument, error: any): void {
  let Out: PublishDiagnosticsParams = {
    uri: GetFilepath(doc.uri),
    diagnostics: [],
  };

  let Message = "Invalid json";
  let R = EmptyTypes.EmptyRange();

  if (error.message) {
    Message = error.message;

    if (Message.startsWith("Unexpected token")) {
      let Index = Message.indexOf("position ");
      let Number = Message.slice(Index + 8, Message.length);
      let position = doc.positionAt(parseInt(Number));
      R = Range.create(position, position);
    }
  }

  Out.diagnostics.push(Diagnostic.create(R, Message));

  Manager.Connection.sendDiagnostics(Out);
}

export function ValidJson(doc: TextDocument): void {}
