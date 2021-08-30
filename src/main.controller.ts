import { HtmlResponse, http } from '@deepkit/http';


export class MainController {
  @http.GET()
  index() {
    return new HtmlResponse(`
    <h2>Hello there!</h2>
    
    <p>
        This is an example of a Deepkit Framework application with the Deepkit API Console.
    </p>
    
    <p>
        Please open this link to open the API Console: <a href="/api">/api</a>.
    </p>
    
    <p>
        To see the Framework Debugger, open this link: <a href="/_debug">/_debug</a>.
    </p>
    
    `)
  }
}
