'use strict';

class Translator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {output_file_path: ''}
  }

  onSubmit(e) {
      e.preventDefault();
      this.setState({output_file_path: ''}) // trigger rerender, TODO: avoid rerender
      fetch('/api/latex_to_pdf', {
          method: 'POST',
          body: JSON.stringify({content: this.inputContent.value}),
          headers: {
              'Content-Type': 'application/json'
          }
      }).then(response => {
          if (response.ok) return response.json()
      }).then(json => {
          this.setState({output_file_path: "/ui/" + json['file_name']}) // trigger rerender
      }).catch(err => {
          console.log('Error:', err);
      })
  }

  render() {
    return (
        <div>
            <form onSubmit={(e) => this.onSubmit(e)}>
                <input type="text" ref={content => (this.inputContent = content)} />
                <button class="btn btn-primary" type="submit">Go</button>
            </form>
            <iframe src={this.state.output_file_path} />
        </div>
    );
  }
}

export { Translator }