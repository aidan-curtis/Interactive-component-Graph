
	

import java.net.URLEncoder;

import javafx.application.Application;
import javafx.embed.swing.SwingFXUtils;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.HPos;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.geometry.VPos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.SnapshotParameters;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.control.ToolBar;
import javafx.scene.image.WritableImage;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.FileChooser;
import javafx.stage.FileChooser.ExtensionFilter;
import javafx.stage.Stage;
import java.io.*;
import javax.imageio.ImageIO;
import org.apache.commons.net.ftp.FTPClient;


 
public class Main extends Application {
    private Scene scene;
    @Override public void start(Stage stage) {
    	
    	
    	//create temporary file outside of application
    	
    	
    	
    	
        // create the scene
    	
    	
        stage.setTitle("CSV visualization");
        Browser b =new Browser();
        BorderPane sp=new BorderPane();
        VBox bottomStack=new VBox();
        
        
        FileChooser csvfinder= new FileChooser();
        ExtensionFilter filter= new ExtensionFilter("csv only", "*.csv");
        csvfinder.getExtensionFilters().add(filter);
        csvfinder.setTitle("Find CSV File");
        
        //initializing bounds and panes
        VBox topStack = new VBox();  //Creates a container to hold all Menu Objects.
    	MenuBar mainMenu = new MenuBar();  //Creates our main menu to hold our Sub-Menus.
    	ToolBar toolBar = new ToolBar();  //Creates our tool-bar to hold the buttons.
    	topStack.getChildren().add(mainMenu);
    	topStack.getChildren().add(toolBar);
    	 
    	
    	Menu file = new Menu("File");
    	MenuItem openFile = new MenuItem("Open CSV File");
    	MenuItem exitApp = new MenuItem("Exit");
    	file.getItems().addAll(openFile,exitApp);
    	 
    	//Create and add the "Edit" sub-menu options.
    	Menu edit = new Menu("Edit");
    	MenuItem properties = new MenuItem("Save Frame Image");
    	edit.getItems().add(properties);
    	 
    	//Create and add the "Help" sub-menu options.
    	Menu help = new Menu("Help");
    	MenuItem visitWebsite = new MenuItem("About");
    	help.getItems().add(visitWebsite);
    	mainMenu.getMenus().addAll(file, edit, help);
    	
    	
        Options rightStack= new Options(b);
        Label file_notif= new Label();
        file_notif.setText("No file");
        file_notif.setFont(Font.font("Tahoma", FontWeight.NORMAL, 15));
        topStack.setAlignment(Pos.CENTER_LEFT);
        bottomStack.getChildren().add(file_notif);

        //aligning boxes
        b.refresh();
        sp.setCenter(b);
       
        sp.setTop(topStack);
        sp.setRight(rightStack);
        sp.setBottom(bottomStack);
        properties.setOnAction(new EventHandler<ActionEvent>(){
        	@Override
        	public void handle(ActionEvent event){
        		WritableImage image = b.snapshot(new SnapshotParameters(), null);
        		FileChooser chooser= new FileChooser();
        	    // TODO: probably use a file chooser here
        	    File file = chooser.showSaveDialog(stage);

        	    try {
        	        ImageIO.write(SwingFXUtils.fromFXImage(image, null), "png", file);
        	    } catch (IOException e) {
        	        // TODO: handle exception here
        	    }
        	}
        });
       
        visitWebsite.setOnAction(new EventHandler<ActionEvent>() {
            public void handle(ActionEvent event) {
                Stage stage = new Stage();
				//Fill stage with content
                StackPane sp=new StackPane();
                Label ta=new Label();
                ta.minHeight(400);
                ta.minWidth(400);

                
                ta.setText("This is a tool that was developed by PowerAmerica to help "
                		+ "visualize multidimensional CSV files on a 2D graph. It's "
                		+ "initial use was visualization of the relationships between "
                		+ "the specifications of different electrical components as shown"
                		+ " by the sample data. Use the file menu option to upload any CSV file and use"
                		+ " the option bars on the right pane to control the dimensions "
                		+ "that you want to put on the graph.");
                ta.setWrapText(true);
                ta.setPadding(new Insets(10,10,10,10));
                sp.setAlignment(Pos.TOP_LEFT);
                sp.getChildren().add(ta);
                
                Scene s= new Scene(sp, 400, 400);
                stage.setScene(s);
                
               
                
				stage.show();
            }
        });
        
        
        exitApp.setOnAction(new EventHandler<ActionEvent>(){
        	@Override
        	public void handle(ActionEvent event){
        		System.exit(0);
        	}
        });
       
        //button event handlers
        openFile.setOnAction(new EventHandler<ActionEvent>(){
        	@Override
        	public void handle(ActionEvent event){
        		File file=csvfinder.showOpenDialog(stage);
        		System.out.println(file.getName());
        		
        		file_notif.setText(file.getName());
        		//write name to file for javascript to use
			 	
        		FTPClient client = new FTPClient();
        		FileInputStream fis = null;

        		try {
        		    client.connect("ftp.enloecompsci.com");
        		    client.login("southpawac", "**********");
        		    client.changeWorkingDirectory("/public_html/PowerAmerica/CSV_FILES");
        		      System.out.print(client.getReplyString());
        		    fis = new FileInputStream(file.getPath());
        		    client.storeFile(file.getName(), fis);
        		    b.fileName=file.getName();
        		    client.logout();
        		} catch (IOException e) {
        		    e.printStackTrace();
        		} finally {
        		    try {
        		        if (fis != null) {
        		            fis.close();
        		        }
        		        client.disconnect();
        		    } catch (IOException e) {
        		        e.printStackTrace();
        		    }
        		}

		 	BufferedReader br ;
		 	 try {
				br = new BufferedReader(new FileReader(new File(file.getPath())));
				String options;
				if((options=br.readLine()) != null){
					rightStack.resetOptions(options.split(","));
					rightStack.setSizes();
				}
				
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
	}
	
	
});
        
        scene = new Scene(sp,1000,850, Color.web("#666970"));  
        stage.setScene(scene);  
        stage.show();
    }
    public static void main(String[] args){
        launch(args);
    }
}
class Options extends VBox{
    ComboBox<String> ypicker= new ComboBox<String>();
    ComboBox<String> xpicker= new ComboBox<String>();
    ComboBox<String> colorpicker = new ComboBox<String>();
    ComboBox<String> typepicker = new ComboBox<String>();
    Button btn= new Button("Refresh");

    
    
    
    public void setSizes(){
    	System.out.println(this.getWidth());
    	xpicker.setMinWidth(this.getWidth());
    	ypicker.setMinWidth(this.getWidth());
    	colorpicker.setMinWidth(this.getWidth());
    	
    }
	public void resetOptions(String [] options){
		xpicker.getItems().addAll(options);
		ypicker.getItems().addAll(options);
		colorpicker.getItems().addAll(options);
		
		System.out.println("asdfasd");
		
	}
	public Options(Browser b){
		
        //combo boxing
        
        ypicker.getItems().addAll("No CSV file selected");
        xpicker.getItems().addAll("No CSV file selected"); 
        colorpicker.getItems().addAll("No CSV file selected");
        
        typepicker.getItems().addAll("Regular Scatter", "Voronoi Tesselation", "Centroids");
        
        
        ypicker.setPromptText("Assert Y Axis");
        xpicker.setPromptText("Assert X Axis");
        colorpicker.setPromptText("Assert Color Scale");
        typepicker.setPromptText("Type of visualization");
        getChildren().addAll(xpicker, ypicker,colorpicker,typepicker, btn);
        
        btn.setOnAction(new EventHandler<ActionEvent>(){
        	@Override
        	public void handle(ActionEvent event){
        		
        		
        		b.xAxisInput=xpicker.getValue();
        		b.yAxisInput=ypicker.getValue();
        		b.type=typepicker.getValue();
        		b.color=colorpicker.getValue();
        		
         	    b.refresh();
         	           
         	            
     
        		
        		
        	}
        });
		
	}
	
	
}
class Browser extends Region {
 
    final WebView browser = new WebView();
    final WebEngine webEngine = browser.getEngine();
    public String fileName, xAxisInput, yAxisInput, color, type;
    public void refresh(){
    	String local_resource="http://www.enloecompsci.com/PowerAmerica/manufacturers_java.php?"
    			+"fileName=CSV_FILES/"+fileName
    			+"&xAxisInput="+xAxisInput
    			+"&yAxisInput="+yAxisInput
    			+"&color="+color
    			+"&type="+type;
    	
    	System.out.println(local_resource);
    	try {
			System.out.println(URLEncoder.encode(local_resource, "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	webEngine.load(local_resource);
    	layoutChildren();
    }
    public Browser() {
        //apply the styles
        getStyleClass().add("browser");
        getChildren().add(browser);
        browser.setZoom(0.45);
 
    }
    private Node createSpacer() {
        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        return spacer;
    }
    @Override protected void layoutChildren() {
        double w = getWidth();
        double h = getHeight();
        layoutInArea(browser,0,0,w,h,0, HPos.CENTER, VPos.CENTER);
    }
 
    @Override protected double computePrefWidth(double height) {
        return 750;
    }
 
    @Override protected double computePrefHeight(double width) {
        return 500;
    }
}
