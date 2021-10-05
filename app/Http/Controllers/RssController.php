<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RssController extends Controller
{
    private $podcastList = [];

    public function rssLoader()
    {
        $feeds = array(
            "nerdcast" => "https://jovemnerd.com.br/feed-nerdcast/",
            "gugacast" => "https://www.omnycontent.com/d/playlist/0009b167-0e82-414e-91eb-aae8011fc66d/4f6d62c7-be7a-4d80-bc62-ace2013528cb/81c945fb-1467-45ed-b193-ace2013528de/podcast.rss",
            "theapologyline" => "https://rss.art19.com/apology-line",
            "99vidas" => "http://99vidas.com.br/feed.xml",
            "naruhodo" => "https://feeds.simplecast.com/hwQVm5gy"
        );
        
        $entries = array();
        foreach($feeds as $key => $feed) {
            $xml = simplexml_load_file($feed);
            $entries = array_merge($entries, $xml->xpath("//channel"));
        }

        usort($entries, function ($feed1, $feed2) {
            return strtotime($feed2->pubDate) - strtotime($feed1->pubDate);
        });

        foreach($entries as $entry) {
            $a = is_dir(str_replace(' ', '', 'podcasts/'.strtolower($entry->title)));

            if (!$a) {
                mkdir(str_replace(' ', '', 'podcasts/'.strtolower($entry->title)));
            }
            $entry['podcastName'] = 'podcast-name-'.(string) str_replace(' ', '',strtolower($entry->title));
            $path = str_replace(' ', '', 'podcasts/'.strtolower($entry->title).'/'.strtolower($entry->title).'.json');
            $fp = fopen($path, 'w');
            fwrite($fp, json_encode($entry));
            fclose($fp);
            
            array_push($this->podcastList, [
                'podcastName' => 'podcast-name-'.(string) str_replace(' ', '',strtolower($entry->title)),
                'path' => (string) $path,
                'image' => (string) $entry->image->url,
                'title' => (string) $entry->title,
                'description' => (string) $entry->description
                ]
            );
        }

        $fp = fopen('podcasts/podcastList.json', 'w');
        fwrite($fp, json_encode($this->podcastList));
        fclose($fp);

        $this->getPodcastFile();
    }

    public function getPodcastFile()
    {
        $json = json_decode(file_get_contents('podcasts/podcastList.json'));
        $podcastItens = [];
        foreach($json as $item) {
            
            array_push($podcastItens, [
                'title' => $item->title, 
                'description' => $item->description, 
                'image' => $item->image,
                'podcastName' => $item->podcastName
            ]);
        }

        echo json_encode($podcastItens);
    }

    public function selectPodcast(string $podcastName)
    {
        $json = json_decode(file_get_contents('podcasts/podcastList.json'));
        foreach($json as $item) {
            if($item->podcastName == $podcastName) {
                $a = file_get_contents($item->path);
                echo $a;
            }
        }
    }
}
